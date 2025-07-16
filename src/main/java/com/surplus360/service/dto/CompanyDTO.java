package com.surplus360.service.dto;

import com.surplus360.domain.enums.CompanyType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDTO {

    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    private CompanyType type;

    @Size(max = 50)
    private String industry;

    private String description;

    @Size(max = 255)
    private String website;

    @Size(max = 20)
    private String phone;

    @Email
    @Size(max = 100)
    private String email;

    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 10)
    private String postalCode;

    @Size(max = 50)
    private String country;

    @Size(max = 100)
    private String location;

    @Size(max = 500)
    private String logo;

    @Min(0)
    @Max(100)
    private Integer rseScore;

    private Boolean verified = false;

    private String certifications;

    private CompanyStatsDTO stats;

    private List<UserProfileDTO> users;

    private List<ProductDTO> products;

    private Instant createdDate;

    private Instant lastModifiedDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyStatsDTO {
        private Integer totalSurplus = 0;
        private Integer totalDonations = 0;
        private Integer totalSales = 0;
        private BigDecimal co2Saved = BigDecimal.ZERO;
        private BigDecimal wasteReduced = BigDecimal.ZERO;
    }

    // Constructor for creating DTO from Company entity
    public CompanyDTO(Long id, String name, CompanyType type, String industry, 
                     String description, String website, String phone, String email, 
                     String address, String city, String postalCode, String country, 
                     String location, String logo, Integer rseScore, Boolean verified, 
                     String certifications, Integer totalSurplus, Integer totalDonations, 
                     Integer totalSales, BigDecimal co2Saved, BigDecimal wasteReduced, 
                     Instant createdDate) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.industry = industry;
        this.description = description;
        this.website = website;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.location = location;
        this.logo = logo;
        this.rseScore = rseScore;
        this.verified = verified;
        this.certifications = certifications;
        this.createdDate = createdDate;
        
        this.stats = new CompanyStatsDTO(totalSurplus, totalDonations, totalSales, 
                                        co2Saved, wasteReduced);
    }
}