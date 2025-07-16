package com.surplus360.web.rest;

import com.surplus360.domain.User;
import com.surplus360.security.jwt.JWTUtil;
import com.surplus360.service.EmailService;
import com.surplus360.service.UserService;
import com.surplus360.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final EmailService emailService;

    /**
     * Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        log.debug("REST request to authenticate user: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtUtil.generateToken(authentication);
            String refreshToken = jwtUtil.generateRefreshToken(authentication);
            Long expiresIn = jwtUtil.getExpirationTime();
            Instant expiresAt = Instant.now().plusSeconds(expiresIn);

            // Get user details
            Optional<User> userOpt = userService.getUserWithAuthoritiesByLogin(loginRequest.getUsername());
            User userEntity = userOpt.orElse(null);

            // Update last login
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setLastLogin(Instant.now());
                userService.updateUser(user);
            }

            TokenResponse tokenResponse = new TokenResponse(accessToken, refreshToken, expiresIn, expiresAt, userEntity);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);

            return ResponseEntity.ok()
                .headers(headers)
                .body(tokenResponse);

        } catch (Exception e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new BadRequestAlertException("Invalid credentials", "authentication", "invalidCredentials");
        }
    }

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        log.debug("REST request to register user: {}", user.getLogin());

        if (user.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
        }

        if (userService.getUserWithAuthoritiesByLogin(user.getLogin().toLowerCase()).isPresent()) {
            throw new BadRequestAlertException("Login name already used", "userManagement", "userexists");
        }

        if (userService.getUserWithAuthoritiesByEmail(user.getEmail()).isPresent()) {
            throw new BadRequestAlertException("Email is already in use", "userManagement", "emailexists");
        }

        User newUser = userService.registerUser(user, "tempPassword123"); // User will need to set password via email
        User result = newUser;

        // Send activation email
        emailService.sendActivationEmail(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Activate user account
     */
    @GetMapping("/activate")
    public ResponseEntity<Void> activateAccount(@RequestParam(value = "key") String key) {
        log.debug("REST request to activate account with key: {}", key);

        Optional<User> user = userService.activateRegistration(key);
        if (user.isEmpty()) {
            throw new BadRequestAlertException("Invalid activation key", "userManagement", "invalidkey");
        }

        // Send welcome email
        emailService.sendWelcomeEmail(user.get());

        return ResponseEntity.ok().build();
    }

    /**
     * Request password reset
     */
    @PostMapping("/reset-password/init")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody String email) {
        log.debug("REST request to reset password for email: {}", email);

        Optional<User> user = userService.requestPasswordReset(email);
        if (user.isPresent()) {
            emailService.sendPasswordResetEmail(user.get());
        }

        // Always return success for security reasons
        return ResponseEntity.ok().build();
    }

    /**
     * Complete password reset
     */
    @PostMapping("/reset-password/finish")
    public ResponseEntity<Void> finishPasswordReset(@Valid @RequestBody PasswordResetRequest resetRequest) {
        log.debug("REST request to finish password reset with key: {}", resetRequest.getKey());

        Optional<User> user = userService.completePasswordReset(resetRequest.getNewPassword(), resetRequest.getKey());
        if (user.isEmpty()) {
            throw new BadRequestAlertException("Invalid reset key", "userManagement", "invalidkey");
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Change password for authenticated user
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        log.debug("REST request to change password for current user");

        if (passwordChangeDTO.getCurrentPassword() == null || passwordChangeDTO.getNewPassword() == null) {
            throw new BadRequestAlertException("Current password and new password are required", "userManagement", "passwordrequired");
        }

        try {
            userService.changePassword(passwordChangeDTO.getCurrentPassword(), passwordChangeDTO.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (UserService.InvalidPasswordException e) {
            throw new BadRequestAlertException("Invalid current password", "userManagement", "invalidpassword");
        }
    }

    /**
     * Refresh JWT token
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestBody TokenRefreshDTO refreshDTO) {
        log.debug("REST request to refresh JWT token");

        try {
            if (!jwtUtil.validateToken(refreshDTO.getRefreshToken())) {
                throw new BadRequestAlertException("Invalid refresh token", "authentication", "invalidtoken");
            }

            String username = jwtUtil.getUsernameFromToken(refreshDTO.getRefreshToken());
            Optional<User> userOpt = userService.getUserWithAuthoritiesByLogin(username);

            if (userOpt.isEmpty()) {
                throw new BadRequestAlertException("User not found", "authentication", "usernotfound");
            }

            User user = userOpt.get();
            // Map authorities to GrantedAuthority
            Collection<? extends GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                .map(auth -> new org.springframework.security.core.authority.SimpleGrantedAuthority(auth.getName()))
                .toList();
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, grantedAuthorities);
            String accessToken = jwtUtil.generateToken(authentication);
            String newRefreshToken = jwtUtil.generateRefreshToken(authentication);
            Long expiresIn = jwtUtil.getExpirationTime();
            Instant expiresAt = Instant.now().plusSeconds(expiresIn);

            User userEntity2 = user;
            TokenResponse tokenResponse = new TokenResponse(accessToken, newRefreshToken, expiresIn, expiresAt, userEntity2);

            return ResponseEntity.ok(tokenResponse);

        } catch (Exception e) {
            log.error("Token refresh failed", e);
            throw new BadRequestAlertException("Token refresh failed", "authentication", "refreshfailed");
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        log.debug("REST request to logout current user");

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    /**
     * Get current user account
     */
    @GetMapping("/account")
    public ResponseEntity<User> getAccount() {
        log.debug("REST request to get current user account");

        return userService.getUserWithAuthorities()
            .map(user -> ResponseEntity.ok().body(user))
            .orElseThrow(() -> new BadRequestAlertException("User could not be found", "userManagement", "usernotfound"));
    }

    /**
     * Update current user account
     */
    @PostMapping("/account")
    public ResponseEntity<User> saveAccount(@Valid @RequestBody User user) {
        log.debug("REST request to save account for current user");

        return userService.getUserWithAuthorities()
            .map(currentUser -> {
                userService.updateUser(user.getFirstName(), user.getLastName(), 
                                     user.getEmail(), user.getLangKey(), user.getImageUrl());
                return ResponseEntity.ok().body(currentUser);
            })
            .orElseThrow(() -> new BadRequestAlertException("User could not be found", "userManagement", "usernotfound"));
    }

    /**
     * Check if user is authenticated
     */
    @GetMapping("/authenticated")
    public ResponseEntity<Boolean> isAuthenticated() {
        log.debug("REST request to check if the current user is authenticated");
        return ResponseEntity.ok(userService.getUserWithAuthorities().isPresent());
    }

    /**
     * Password change DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class PasswordChangeDTO {
        private String currentPassword;
        private String newPassword;
    }

    /**
     * Token refresh DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TokenRefreshDTO {
        private String refreshToken;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class PasswordResetRequest {
        private String key;
        private String newPassword;
    }
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TokenResponse {
        private String accessToken;
        private String refreshToken;
        private Long expiresIn;
        private Instant expiresAt;
        private User user;
    }
}