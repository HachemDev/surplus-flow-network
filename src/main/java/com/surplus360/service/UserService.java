package com.surplus360.service;

import com.surplus360.domain.Authority;
import com.surplus360.domain.User;
import com.surplus360.domain.UserProfile;
import com.surplus360.repository.AuthorityRepository;
import com.surplus360.repository.UserProfileRepository;
import com.surplus360.repository.UserRepository;
import com.surplus360.security.AuthoritiesConstants;
import com.surplus360.security.SecurityUtils;
import com.surplus360.service.dto.UserDTO;
import com.surplus360.service.mapper.UserMapper;
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
    private final UserMapper userMapper;
    private final CacheManager cacheManager;

    /**
     * Create a new user with the provided information
     */
    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail().toLowerCase());
        user.setImageUrl(userDTO.getImageUrl());
        user.setLangKey(userDTO.getLangKey());
        user.setRole(userDTO.getRole());

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
        
        // Create user profile
        createUserProfile(user, userDTO);
        
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update user information
     */
    public Optional<UserDTO> updateUser(UserDTO userDTO) {
        return Optional.of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                clearUserCaches(user);
                user.setLogin(userDTO.getLogin().toLowerCase());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                user.setEmail(userDTO.getEmail().toLowerCase());
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                user.setRole(userDTO.getRole());
                
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                userDTO.getAuthorities().stream()
                    .map(authorityRepository::findByName)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(managedAuthorities::add);
                
                user = userRepository.save(user);
                clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(userMapper::toDto);
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
    public Optional<UserDTO> updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
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
            })
            .map(userMapper::toDto);
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
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    /**
     * Get all users with authorities
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, "anonymoususer").map(userMapper::toDto);
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
    public User registerUser(UserDTO userDTO, String password) {
        userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new UsernameAlreadyUsedException();
            }
        });
        
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new EmailAlreadyUsedException();
            }
        });
        
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setEmail(userDTO.getEmail().toLowerCase());
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        newUser.setRole(userDTO.getRole());
        newUser.setActivated(false);
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findByName(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        
        newUser = userRepository.save(newUser);
        clearUserCaches(newUser);
        
        // Create user profile
        createUserProfile(newUser, userDTO);
        
        log.debug("Created Information for User: {}", newUser);
        return newUser;
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

    private void createUserProfile(User user, UserDTO userDTO) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(userDTO.getFirstName());
        profile.setLastName(userDTO.getLastName());
        profile.setEmail(userDTO.getEmail().toLowerCase());
        profile.setRole(userDTO.getRole());
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