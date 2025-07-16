package com.surplus360.service.dto;

import com.surplus360.domain.enums.NotificationType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;

    @NotBlank
    @Size(max = 50)
    private String userId;

    @NotNull
    private NotificationType type;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String message;

    private String data;

    private Boolean read = false;

    @Size(max = 10)
    private String priority = "MEDIUM";

    private Instant readAt;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from Notification entity
    public NotificationDTO(Long id, String userId, NotificationType type, 
                          String title, String message, String data, 
                          Boolean read, String priority, Instant readAt, 
                          Instant createdDate) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.data = data;
        this.read = read;
        this.priority = priority;
        this.readAt = readAt;
        this.createdDate = createdDate;
    }

    // Helper method to check if notification is unread
    public boolean isUnread() {
        return !Boolean.TRUE.equals(read);
    }

    // Helper method to check if notification is high priority
    public boolean isHighPriority() {
        return "HIGH".equals(priority);
    }
}