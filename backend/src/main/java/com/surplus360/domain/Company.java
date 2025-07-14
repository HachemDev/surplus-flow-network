package com.surplus360.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.surplus360.domain.enumeration.CompanyType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CompanyType type;

    @Size(max = 50)
    @Column(name = "industry", length = 50)
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

    @NotNull
    @Size(max = 100)
    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Lob
    @Column(name = "address")
    private String address;

    @Size(max = 50)
    @Column(name = "city", length = 50)
    private String city;

    @Size(max = 10)
    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Size(max = 50)
    @Column(name = "country", length = 50)
    private String country;

    @Size(max = 100)
    @Column(name = "location", length = 100)
    private String location;

    @Size(max = 500)
    @Column(name = "logo", length = 500)
    private String logo;

    @Min(value = 0)
    @Max(value = 100)
    @Column(name = "rse_score")
    private Integer rseScore;

    @Column(name = "verified")
    private Boolean verified;

    @Lob
    @Column(name = "certifications")
    private String certifications;

    @Column(name = "total_surplus")
    private Integer totalSurplus;

    @Column(name = "total_donations")
    private Integer totalDonations;

    @Column(name = "total_sales")
    private Integer totalSales;

    @Column(name = "co_2_saved", precision = 21, scale = 2)
    private BigDecimal co2Saved;

    @Column(name = "waste_reduced", precision = 21, scale = 2)
    private BigDecimal wasteReduced;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "company" }, allowSetters = true)
    private Set<UserProfile> users = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "owner", "company" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Company id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Company name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CompanyType getType() {
        return this.type;
    }

    public Company type(CompanyType type) {
        this.setType(type);
        return this;
    }

    public void setType(CompanyType type) {
        this.type = type;
    }

    public String getIndustry() {
        return this.industry;
    }

    public Company industry(String industry) {
        this.setIndustry(industry);
        return this;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getDescription() {
        return this.description;
    }

    public Company description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsite() {
        return this.website;
    }

    public Company website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getPhone() {
        return this.phone;
    }

    public Company phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return this.email;
    }

    public Company email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return this.address;
    }

    public Company address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return this.city;
    }

    public Company city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public Company postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return this.country;
    }

    public Company country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocation() {
        return this.location;
    }

    public Company location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLogo() {
        return this.logo;
    }

    public Company logo(String logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Integer getRseScore() {
        return this.rseScore;
    }

    public Company rseScore(Integer rseScore) {
        this.setRseScore(rseScore);
        return this;
    }

    public void setRseScore(Integer rseScore) {
        this.rseScore = rseScore;
    }

    public Boolean getVerified() {
        return this.verified;
    }

    public Company verified(Boolean verified) {
        this.setVerified(verified);
        return this;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getCertifications() {
        return this.certifications;
    }

    public Company certifications(String certifications) {
        this.setCertifications(certifications);
        return this;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public Integer getTotalSurplus() {
        return this.totalSurplus;
    }

    public Company totalSurplus(Integer totalSurplus) {
        this.setTotalSurplus(totalSurplus);
        return this;
    }

    public void setTotalSurplus(Integer totalSurplus) {
        this.totalSurplus = totalSurplus;
    }

    public Integer getTotalDonations() {
        return this.totalDonations;
    }

    public Company totalDonations(Integer totalDonations) {
        this.setTotalDonations(totalDonations);
        return this;
    }

    public void setTotalDonations(Integer totalDonations) {
        this.totalDonations = totalDonations;
    }

    public Integer getTotalSales() {
        return this.totalSales;
    }

    public Company totalSales(Integer totalSales) {
        this.setTotalSales(totalSales);
        return this;
    }

    public void setTotalSales(Integer totalSales) {
        this.totalSales = totalSales;
    }

    public BigDecimal getCo2Saved() {
        return this.co2Saved;
    }

    public Company co2Saved(BigDecimal co2Saved) {
        this.setCo2Saved(co2Saved);
        return this;
    }

    public void setCo2Saved(BigDecimal co2Saved) {
        this.co2Saved = co2Saved;
    }

    public BigDecimal getWasteReduced() {
        return this.wasteReduced;
    }

    public Company wasteReduced(BigDecimal wasteReduced) {
        this.setWasteReduced(wasteReduced);
        return this;
    }

    public void setWasteReduced(BigDecimal wasteReduced) {
        this.wasteReduced = wasteReduced;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Company createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Company updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<UserProfile> getUsers() {
        return this.users;
    }

    public void setUsers(Set<UserProfile> userProfiles) {
        if (this.users != null) {
            this.users.forEach(i -> i.setCompany(null));
        }
        if (userProfiles != null) {
            userProfiles.forEach(i -> i.setCompany(this));
        }
        this.users = userProfiles;
    }

    public Company users(Set<UserProfile> userProfiles) {
        this.setUsers(userProfiles);
        return this;
    }

    public Company addUsers(UserProfile userProfile) {
        this.users.add(userProfile);
        userProfile.setCompany(this);
        return this;
    }

    public Company removeUsers(UserProfile userProfile) {
        this.users.remove(userProfile);
        userProfile.setCompany(null);
        return this;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        if (this.products != null) {
            this.products.forEach(i -> i.setCompany(null));
        }
        if (products != null) {
            products.forEach(i -> i.setCompany(this));
        }
        this.products = products;
    }

    public Company products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Company addProducts(Product product) {
        this.products.add(product);
        product.setCompany(this);
        return this;
    }

    public Company removeProducts(Product product) {
        this.products.remove(product);
        product.setCompany(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Company)) {
            return false;
        }
        return getId() != null && getId().equals(((Company) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", industry='" + getIndustry() + "'" +
            ", description='" + getDescription() + "'" +
            ", website='" + getWebsite() + "'" +
            ", phone='" + getPhone() + "'" +
            ", email='" + getEmail() + "'" +
            ", address='" + getAddress() + "'" +
            ", city='" + getCity() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", country='" + getCountry() + "'" +
            ", location='" + getLocation() + "'" +
            ", logo='" + getLogo() + "'" +
            ", rseScore=" + getRseScore() +
            ", verified='" + getVerified() + "'" +
            ", certifications='" + getCertifications() + "'" +
            ", totalSurplus=" + getTotalSurplus() +
            ", totalDonations=" + getTotalDonations() +
            ", totalSales=" + getTotalSales() +
            ", co2Saved=" + getCo2Saved() +
            ", wasteReduced=" + getWasteReduced() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
