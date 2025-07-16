package com.surplus360.domain;

import com.surplus360.domain.enums.UserRole;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class UserProfile extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @NotNull
    @Size(max = 50)
    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

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

    @Size(max = 500)
    @Column(name = "avatar", length = 500)
    private String avatar;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @NotNull
    @Email
    @Size(max = 100)
    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Size(max = 50)
    @Column(name = "company_id", length = 50)
    private String companyId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Company company;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProfile)) return false;
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + id +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", role=" + role +
            ", isVerified=" + isVerified +
            '}';
    }
}