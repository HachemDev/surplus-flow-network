package com.surplus.controller;

import com.surplus.domain.Authority;
import com.surplus.domain.User;
import com.surplus.domain.UserProfile;
import com.surplus.domain.enumeration.UserRole;
import com.surplus.repository.AuthorityRepository;
import com.surplus.repository.UserProfileRepository;
import com.surplus.repository.UserRepository;
import com.surplus.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication, loginRequest.isRememberMe());

            Map<String, String> response = new HashMap<>();
            response.put("id_token", jwt);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Authentication failed"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByLogin(registerRequest.getLogin())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email is already in use!"));
        }

        // Create new user
        User user = new User();
        user.setLogin(registerRequest.getLogin());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setActivated(true);
        user.setLangKey(registerRequest.getLangKey() != null ? registerRequest.getLangKey() : "en");

        // Set default role
        Set<Authority> authorities = new HashSet<>();
        Authority userAuthority = authorityRepository.findById("ROLE_INDIVIDUAL")
            .orElseGet(() -> {
                Authority auth = new Authority("ROLE_INDIVIDUAL");
                return authorityRepository.save(auth);
            });
        authorities.add(userAuthority);
        user.setAuthorities(authorities);

        User savedUser = userRepository.save(user);

        // Create user profile
        UserProfile userProfile = new UserProfile();
        userProfile.setFirstName(registerRequest.getFirstName());
        userProfile.setLastName(registerRequest.getLastName());
        userProfile.setEmail(registerRequest.getEmail());
        userProfile.setRole(UserRole.INDIVIDUAL);
        userProfile.setUser(savedUser);
        userProfileRepository.save(userProfile);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @GetMapping("/account")
    public ResponseEntity<?> getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            
            Map<String, Object> account = new HashMap<>();
            account.put("id", user.getId());
            account.put("login", user.getLogin());
            account.put("firstName", user.getFirstName());
            account.put("lastName", user.getLastName());
            account.put("email", user.getEmail());
            account.put("activated", user.isActivated());
            account.put("langKey", user.getLangKey());
            account.put("authorities", user.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toArray());
            
            return ResponseEntity.ok(account);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Inner classes for request/response
    public static class LoginRequest {
        private String username;
        private String password;
        private boolean rememberMe;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public boolean isRememberMe() { return rememberMe; }
        public void setRememberMe(boolean rememberMe) { this.rememberMe = rememberMe; }
    }

    public static class RegisterRequest {
        private String login;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String langKey;

        public String getLogin() { return login; }
        public void setLogin(String login) { this.login = login; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getLangKey() { return langKey; }
        public void setLangKey(String langKey) { this.langKey = langKey; }
    }
}