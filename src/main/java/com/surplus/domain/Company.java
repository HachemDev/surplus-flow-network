package com.surplus.domain;

import com.surplus.domain.enumeration.CompanyType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CompanyType type;

    @Size(max = 100)
    @Column(name = "industry", length = 100)
    private String industry;

    @Lob
    @Column(name = "description")
    private String description;

    @Size(max = 255)
    @Column(name = "website", length = 255)
    private String website;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Email
    @Size(max = 254)
    @Column(name = "email", length = 254)
    private String email;

    @Size(max = 255)
    @Column(name = "address", length = 255)
    private String address;

    @Size(max = 100)
    @Column(name = "city", length = 100)
    private String city;

    @Size(max = 20)
    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Size(max = 100)
    @Column(name = "country", length = 100)
    private String country;

    @Size(max = 255)
    @Column(name = "location", length = 255)
    private String location;

    @Size(max = 500)
    @Column(name = "logo", length = 500)
    private String logo;

    @Column(name = "rse_score", precision = 5, scale = 2)
    private BigDecimal rseScore;

    @Column(name = "verified")
    private Boolean verified = false;

    @Lob
    @Column(name = "certifications")
    private String certifications;

    @Column(name = "total_surplus")
    private Integer totalSurplus = 0;

    @Column(name = "total_donations")
    private Integer totalDonations = 0;

    @Column(name = "total_sales")
    private Integer totalSales = 0;

    @Column(name = "co2_saved", precision = 10, scale = 2)
    private BigDecimal co2Saved = BigDecimal.ZERO;

    @Column(name = "waste_reduced", precision = 10, scale = 2)
    private BigDecimal wasteReduced = BigDecimal.ZERO;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserProfile> users = new HashSet<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Product> products = new HashSet<>();

    // Constructors
    public Company() {}

    public Company(String name, CompanyType type, String email) {
        this.name = name;
        this.type = type;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CompanyType getType() {
        return type;
    }

    public void setType(CompanyType type) {
        this.type = type;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public BigDecimal getRseScore() {
        return rseScore;
    }

    public void setRseScore(BigDecimal rseScore) {
        this.rseScore = rseScore;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public Integer getTotalSurplus() {
        return totalSurplus;
    }

    public void setTotalSurplus(Integer totalSurplus) {
        this.totalSurplus = totalSurplus;
    }

    public Integer getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(Integer totalDonations) {
        this.totalDonations = totalDonations;
    }

    public Integer getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Integer totalSales) {
        this.totalSales = totalSales;
    }

    public BigDecimal getCo2Saved() {
        return co2Saved;
    }

    public void setCo2Saved(BigDecimal co2Saved) {
        this.co2Saved = co2Saved;
    }

    public BigDecimal getWasteReduced() {
        return wasteReduced;
    }

    public void setWasteReduced(BigDecimal wasteReduced) {
        this.wasteReduced = wasteReduced;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<UserProfile> getUsers() {
        return users;
    }

    public void setUsers(Set<UserProfile> users) {
        this.users = users;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Company company = (Company) o;
        return Objects.equals(id, company.id) && Objects.equals(name, company.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "Company{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", type=" + type +
            ", industry='" + industry + '\'' +
            ", email='" + email + '\'' +
            ", verified=" + verified +
            '}';
    }
}