package com.surplus360.domain;

import com.surplus360.domain.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Entity
@Table(name = "notification")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class Notification extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    @NotNull
    @Size(max = 100)
    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @NotNull
    @Lob
    @Column(name = "message", nullable = false)
    private String message;

    @Lob
    @Column(name = "data")
    private String data;

    @Column(name = "read")
    private Boolean read = false;

    @Size(max = 10)
    @Column(name = "priority", length = 10)
    private String priority = "MEDIUM";

    @Column(name = "read_at")
    private Instant readAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notification)) return false;
        return id != null && id.equals(((Notification) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Notification{" +
            "id=" + id +
            ", userId='" + userId + '\'' +
            ", type=" + type +
            ", title='" + title + '\'' +
            ", read=" + read +
            ", priority='" + priority + '\'' +
            ", createdAt=" + getCreatedAt() +
            '}';
    }
}