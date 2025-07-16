package com.surplus360.service;

import com.surplus360.domain.Authority;
import com.surplus360.domain.User;
import com.surplus360.domain.UserProfile;
import com.surplus360.repository.AuthorityRepository;
import com.surplus360.repository.UserProfileRepository;
import com.surplus360.repository.UserRepository;
import com.surplus360.security.AuthoritiesConstants;
import com.surplus360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final CacheManager cacheManager;

    /**
     * Create a new user with the provided information
     */
    public User createUser(User user) {
        user.setLogin(user.getLogin().toLowerCase());
        user.setEmail(user.getEmail().toLowerCase());
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(false);
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findByName(AuthoritiesConstants.USER).ifPresent(authorities::add);
        user.setAuthorities(authorities);
        user = userRepository.save(user);
        clearUserCaches(user);
        // Optionally create user profile if needed
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update user information
     */
    public Optional<User> updateUser(User user) {
        return Optional.of(userRepository.findById(user.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(existingUser -> {
                clearUserCaches(existingUser);
                existingUser.setLogin(user.getLogin().toLowerCase());
                existingUser.setFirstName(user.getFirstName());
                existingUser.setLastName(user.getLastName());
                existingUser.setEmail(user.getEmail().toLowerCase());
                existingUser.setImageUrl(user.getImageUrl());
                existingUser.setActivated(user.isActivated());
                existingUser.setLangKey(user.getLangKey());
                existingUser.setRole(user.getRole());
                Set<Authority> managedAuthorities = existingUser.getAuthorities();
                managedAuthorities.clear();
                if (user.getAuthorities() != null) {
                    managedAuthorities.addAll(user.getAuthorities());
                }
                existingUser = userRepository.save(existingUser);
                clearUserCaches(existingUser);
                log.debug("Changed Information for User: {}", existingUser);
                return existingUser;
            });
    }

    /**
     * Delete user by login
     */
    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            userRepository.delete(user);
            clearUserCaches(user);
            log.debug("Deleted User: {}", user);
        });
    }

    /**
     * Update only the basic user information
     */
    @Transactional
    public Optional<User> updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .map(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email.toLowerCase());
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                user = userRepository.save(user);
                clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
                return user;
            });
    }

    /**
     * Change user password
     */
    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                clearUserCaches(user);
                log.debug("Changed password for User: {}", user);
            });
    }

    /**
     * Get all managed users
     */
    @Transactional(readOnly = true)
    public Page<User> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Get all users with authorities
     */
    @Transactional(readOnly = true)
    public Page<User> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, "anonymoususer");
    }

    /**
     * Get user by login
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    /**
     * Get user by email
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByEmail(String email) {
        return userRepository.findOneWithAuthoritiesByEmail(email);
    }

    /**
     * Get current user with authorities
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Get current user with authorities by ID
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities(Long id) {
        return userRepository.findOneWithAuthoritiesById(id);
    }

    /**
     * Activate user account
     */
    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                user.setActivated(true);
                user.setActivationKey(null);
                user.setLastLogin(Instant.now());
                user = userRepository.save(user);
                clearUserCaches(user);
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    /**
     * Complete password reset
     */
    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository.findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                user = userRepository.save(user);
                clearUserCaches(user);
                log.debug("Reset password for user: {}", user);
                return user;
            });
    }

    /**
     * Request password reset
     */
    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                user = userRepository.save(user);
                clearUserCaches(user);
                return user;
            });
    }

    /**
     * Register a new user
     */
    public User registerUser(User user, String password) {
        userRepository.findOneByLogin(user.getLogin().toLowerCase()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new UsernameAlreadyUsedException();
            }
        });
        
        userRepository.findOneByEmailIgnoreCase(user.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new EmailAlreadyUsedException();
            }
        });
        
        String encryptedPassword = passwordEncoder.encode(password);
        user.setLogin(user.getLogin().toLowerCase());
        user.setPassword(encryptedPassword);
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setEmail(user.getEmail().toLowerCase());
        user.setImageUrl(user.getImageUrl());
        user.setLangKey(user.getLangKey());
        user.setRole(user.getRole());
        user.setActivated(false);
        user.setActivationKey(RandomUtil.generateActivationKey());
        
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findByName(AuthoritiesConstants.USER).ifPresent(authorities::add);
        user.setAuthorities(authorities);
        
        user = userRepository.save(user);
        clearUserCaches(user);
        
        // Create user profile
        createUserProfile(user);
        
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Remove non-activated users
     */
    @Transactional
    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedAtBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(user -> {
                log.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                clearUserCaches(user);
            });
    }

    /**
     * Get all authorities
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream()
            .map(Authority::getName)
            .toList();
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        clearUserCaches(existingUser);
        return true;
    }

    private void clearUserCaches(User user) {
        if (cacheManager.getCache("users") != null) {
            cacheManager.getCache("users").evict(user.getLogin());
        }
        if (cacheManager.getCache("users") != null) {
            cacheManager.getCache("users").evict(user.getEmail());
        }
    }

    private void createUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setEmail(user.getEmail().toLowerCase());
        profile.setRole(user.getRole());
        profile.setIsVerified(false);
        
        userProfileRepository.save(profile);
    }

    // Custom exceptions
    public static class InvalidPasswordException extends RuntimeException {
        public InvalidPasswordException() {
            super("Incorrect password");
        }
    }

    public static class EmailAlreadyUsedException extends RuntimeException {
        public EmailAlreadyUsedException() {
            super("Email is already in use!");
        }
    }

    public static class UsernameAlreadyUsedException extends RuntimeException {
        public UsernameAlreadyUsedException() {
            super("Login name already used!");
        }
    }
}