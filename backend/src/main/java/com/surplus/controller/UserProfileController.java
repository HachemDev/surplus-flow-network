package com.surplus.controller;

import com.surplus.domain.User;
import com.surplus.domain.UserProfile;
import com.surplus.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<UserProfile> userProfile = userProfileRepository.findByUserId(user.getId());
        if (userProfile.isPresent()) {
            return ResponseEntity.ok(userProfile.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UserProfile userProfile) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(user.getId());
        if (existingProfile.isPresent()) {
            UserProfile profile = existingProfile.get();
            
            // Update allowed fields
            profile.setFirstName(userProfile.getFirstName());
            profile.setLastName(userProfile.getLastName());
            profile.setPhone(userProfile.getPhone());
            profile.setAddress(userProfile.getAddress());
            profile.setCity(userProfile.getCity());
            profile.setPostalCode(userProfile.getPostalCode());
            profile.setCountry(userProfile.getCountry());
            profile.setAvatar(userProfile.getAvatar());
            
            UserProfile savedProfile = userProfileRepository.save(profile);
            return ResponseEntity.ok(savedProfile);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        if (userProfile.isPresent()) {
            return ResponseEntity.ok(userProfile.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody UserProfile userProfile) {
        Optional<UserProfile> existingProfile = userProfileRepository.findById(id);
        if (existingProfile.isPresent()) {
            userProfile.setId(id);
            UserProfile savedProfile = userProfileRepository.save(userProfile);
            return ResponseEntity.ok(savedProfile);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyUserProfile(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            profile.setIsVerified(true);
            UserProfile savedProfile = userProfileRepository.save(profile);
            return ResponseEntity.ok(savedProfile);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/unverify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unverifyUserProfile(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            profile.setIsVerified(false);
            UserProfile savedProfile = userProfileRepository.save(profile);
            return ResponseEntity.ok(savedProfile);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/verified")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getVerifiedProfiles() {
        List<UserProfile> profiles = userProfileRepository.findByVerified(true);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/unverified")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUnverifiedProfiles() {
        List<UserProfile> profiles = userProfileRepository.findByVerified(false);
        return ResponseEntity.ok(profiles);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUserProfile(@PathVariable Long id) {
        if (userProfileRepository.existsById(id)) {
            userProfileRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}