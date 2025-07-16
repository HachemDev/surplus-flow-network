package com.surplus360.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.surplus360.domain.enums.TransactionStatus;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "logistics")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class Logistics extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "carrier_name", length = 100, nullable = false)
    private String carrierName;

    @NotNull
    @Size(max = 100)
    @Column(name = "tracking_number", length = 100, nullable = false)
    private String trackingNumber;

    @Column(name = "pickup_date")
    private Instant pickupDate;

    @Column(name = "estimated_delivery")
    private Instant estimatedDelivery;

    @Column(name = "actual_delivery")
    private Instant actualDelivery;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;

    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @NotNull
    @Lob
    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @NotNull
    @Lob
    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @NotNull
    @Size(max = 100)
    @Column(name = "contact_person", length = 100, nullable = false)
    private String contactPerson;

    @NotNull
    @Size(max = 20)
    @Column(name = "contact_phone", length = 20, nullable = false)
    private String contactPhone;

    @Lob
    @Column(name = "special_instructions")
    private String specialInstructions;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    private Transaction transaction;

    @JsonIgnore
    @OneToMany(mappedBy = "logistics", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TrackingEvent> trackingHistory = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Logistics)) return false;
        return id != null && id.equals(((Logistics) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Logistics{" +
            "id=" + id +
            ", carrierName='" + carrierName + '\'' +
            ", trackingNumber='" + trackingNumber + '\'' +
            ", status=" + status +
            ", estimatedDelivery=" + estimatedDelivery +
            ", actualDelivery=" + actualDelivery +
            '}';
    }
}