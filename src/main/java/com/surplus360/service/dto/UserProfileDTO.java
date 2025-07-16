package com.surplus360.service.dto;

import com.surplus360.domain.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    private Long id;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Size(max = 20)
    private String phone;

    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 10)
    private String postalCode;

    @Size(max = 50)
    private String country;

    @Size(max = 500)
    private String avatar;

    private Boolean isVerified = false;

    private UserRole role;

    @Email
    @Size(max = 100)
    private String email;

    private String companyId;

    private Long userId;

    private CompanyDTO company;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from UserProfile entity
    public UserProfileDTO(Long id, String firstName, String lastName, String phone, 
                         String address, String city, String postalCode, String country, 
                         String avatar, Boolean isVerified, UserRole role, String email, 
                         String companyId, Long userId, Instant createdDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.avatar = avatar;
        this.isVerified = isVerified;
        this.role = role;
        this.email = email;
        this.companyId = companyId;
        this.userId = userId;
        this.createdDate = createdDate;
    }
}