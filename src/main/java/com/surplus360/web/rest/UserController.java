package com.surplus360.web.rest;

import com.surplus360.domain.User;
import com.surplus360.service.UserService;
import com.surplus360.web.rest.errors.BadRequestAlertException;
import com.surplus360.web.rest.util.HeaderUtil;
import com.surplus360.web.rest.util.PaginationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private static final String ENTITY_NAME = "user";
    private final UserService userService;

    /**
     * POST /users : Create a new user (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) throws URISyntaxException {
        log.debug("REST request to save User : {}", user);
        
        if (user.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        if (userService.getUserWithAuthoritiesByLogin(user.getLogin().toLowerCase()).isPresent()) {
            throw new BadRequestAlertException("Login name already used", ENTITY_NAME, "userexists");
        }
        
        if (userService.getUserWithAuthoritiesByEmail(user.getEmail()).isPresent()) {
            throw new BadRequestAlertException("Email is already in use", ENTITY_NAME, "emailexists");
        }
        
        User newUser = userService.createUser(user);
        return ResponseEntity.created(new URI("/api/users/" + newUser.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, newUser.getId().toString()))
            .body(newUser);
    }

    /**
     * PUT /users/{id} : Updates an existing user (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        log.debug("REST request to update User : {}, {}", id, user);
        
        if (user.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        if (!id.equals(user.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        
        Optional<User> updatedUser = userService.updateUser(user);
        
        return updatedUser.map(u -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, u.getId().toString()))
            .body(u))
            .orElseThrow(() -> new BadRequestAlertException("User not found", ENTITY_NAME, "notfound"));
    }

    /**
     * GET /users : get all users (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(
        @RequestParam(value = "activated", required = false) Boolean activated,
        Pageable pageable
    ) {
        log.debug("REST request to get all Users");
        
        Page<User> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /users/public : get all public users
     */
    @GetMapping("/public")
    public ResponseEntity<List<User>> getAllPublicUsers(Pageable pageable) {
        log.debug("REST request to get all public Users");
        
        Page<User> page = userService.getAllPublicUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users/public");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /users/{id} : get user by id
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        log.debug("REST request to get User : {}", id);
        
        return userService.getUserWithAuthorities(id)
            .map(user -> ResponseEntity.ok().body(user))
            .orElseThrow(() -> new BadRequestAlertException("User not found", ENTITY_NAME, "notfound"));
    }

    /**
     * GET /users/login/{login} : get user by login
     */
    @GetMapping("/login/{login}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserByLogin(@PathVariable String login) {
        log.debug("REST request to get User by login : {}", login);
        
        return userService.getUserWithAuthoritiesByLogin(login)
            .map(user -> ResponseEntity.ok().body(user))
            .orElseThrow(() -> new BadRequestAlertException("User not found", ENTITY_NAME, "notfound"));
    }

    /**
     * DELETE /users/{login} : delete user by login (Admin only)
     */
    @DeleteMapping("/{login}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User : {}", login);
        
        userService.deleteUser(login);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, login))
            .build();
    }

    /**
     * GET /users/authorities : get all authorities
     */
    @GetMapping("/authorities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAuthorities() {
        log.debug("REST request to get all authorities");
        
        List<String> authorities = userService.getAuthorities();
        return ResponseEntity.ok(authorities);
    }

    /**
     * POST /users/cleanup : Remove non-activated users (Admin only)
     */
    @PostMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeNotActivatedUsers() {
        log.debug("REST request to remove non-activated users");
        
        userService.removeNotActivatedUsers();
        return ResponseEntity.ok().build();
    }

    /**
     * PUT /users/{id}/activate : Activate user (Admin only)
     */
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        log.debug("REST request to activate User : {}", id);
        
        Optional<User> user = userService.getUserWithAuthorities(id);
        if (user.isEmpty()) {
            throw new BadRequestAlertException("User not found", ENTITY_NAME, "notfound");
        }
        
        User activatedUser = user.get();
        activatedUser.setActivated(true);
        
        User result = userService.updateUser(activatedUser);
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString()))
            .body(result);
    }

    /**
     * PUT /users/{id}/deactivate : Deactivate user (Admin only)
     */
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        log.debug("REST request to deactivate User : {}", id);
        
        Optional<User> user = userService.getUserWithAuthorities(id);
        if (user.isEmpty()) {
            throw new BadRequestAlertException("User not found", ENTITY_NAME, "notfound");
        }
        
        User deactivatedUser = user.get();
        deactivatedUser.setActivated(false);
        
        User result = userService.updateUser(deactivatedUser);
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString()))
            .body(result);
    }

    /**
     * GET /users/search : search users by name (Admin only)
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(
        @RequestParam(value = "query") String query,
        Pageable pageable
    ) {
        log.debug("REST request to search Users with query: {}", query);
        
        // This would require additional implementation in UserService
        // For now, return all users
        Page<User> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users/search");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}