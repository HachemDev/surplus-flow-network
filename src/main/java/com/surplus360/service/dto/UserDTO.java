package com.surplus360.service.dto;

import com.surplus360.domain.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    @NotBlank
    @Size(min = 1, max = 50)
    private String login;

    @NotBlank
    @Size(min = 1, max = 50)
    private String firstName;

    @NotBlank
    @Size(min = 1, max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 254)
    private String email;

    @Size(max = 256)
    private String imageUrl;

    private boolean activated = false;

    @Size(min = 2, max = 10)
    private String langKey;

    private Instant createdDate;

    private Instant lastModifiedDate;

    private Instant lastLogin;

    private UserRole role;

    private Set<String> authorities;

    private UserProfileDTO profile;

    // Constructor for creating DTO from User entity
    public UserDTO(Long id, String login, String firstName, String lastName, String email, 
                   String imageUrl, boolean activated, String langKey, UserRole role, 
                   Instant createdDate, Instant lastLogin) {
        this.id = id;
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.imageUrl = imageUrl;
        this.activated = activated;
        this.langKey = langKey;
        this.role = role;
        this.createdDate = createdDate;
        this.lastLogin = lastLogin;
    }
}