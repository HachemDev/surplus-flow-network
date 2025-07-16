package com.surplus360.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.surplus360.domain.enums.CompanyType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class Company extends AbstractAuditingEntity {

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
    @Email
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

    @Min(0)
    @Max(100)
    @Column(name = "rse_score")
    private Integer rseScore;

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

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<UserProfile> users = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Product> products = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Company)) return false;
        return id != null && id.equals(((Company) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Company{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", type=" + type +
            ", industry='" + industry + '\'' +
            ", email='" + email + '\'' +
            ", location='" + location + '\'' +
            ", verified=" + verified +
            ", rseScore=" + rseScore +
            '}';
    }
}