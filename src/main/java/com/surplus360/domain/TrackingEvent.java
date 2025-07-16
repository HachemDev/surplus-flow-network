package com.surplus360.domain;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "tracking_event")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class TrackingEvent extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @NotNull
    @Size(max = 100)
    @Column(name = "location", length = 100, nullable = false)
    private String location;

    @NotNull
    @Size(max = 50)
    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @NotNull
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "logistics_id", referencedColumnName = "id")
    private Logistics logistics;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrackingEvent)) return false;
        return id != null && id.equals(((TrackingEvent) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "TrackingEvent{" +
            "id=" + id +
            ", timestamp=" + timestamp +
            ", location='" + location + '\'' +
            ", status='" + status + '\'' +
            ", description='" + description + '\'' +
            '}';
    }
}