package com.surplus360.web.rest;

import com.surplus360.domain.enums.NotificationType;
import com.surplus360.service.NotificationService;
import com.surplus360.web.rest.errors.BadRequestAlertException;
import com.surplus360.web.rest.util.HeaderUtil;
import com.surplus360.web.rest.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.surplus360.domain.Notification;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * GET /notifications : Get all notifications for current user
     */
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Notification>> getAllNotifications(
        @RequestParam(value = "read", required = false) Boolean read,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "priority", required = false) String priority,
        Principal principal,
        Pageable pageable
    ) {
        log.debug("REST request to get notifications for user: {}", principal.getName());
        
        String userId = principal.getName();
        Page<Notification> page;
        
        if (read != null && !read) {
            page = notificationService.getUnreadNotifications(userId, pageable);
        } else {
            page = notificationService.getUserNotifications(userId, pageable);
        }
        
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/notifications");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /notifications/count : Get unread notifications count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getUnreadNotificationsCount(Principal principal) {
        log.debug("REST request to get unread notifications count for user: {}", principal.getName());
        
        String userId = principal.getName();
        long count = notificationService.getUnreadNotificationCount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("userId", userId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /notifications/{id}/read : Mark notification as read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id, Principal principal) {
        log.debug("REST request to mark notification {} as read for user: {}", id, principal.getName());
        
        String userId = principal.getName();
        notificationService.markAsRead(id, userId);
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("notification.read", id.toString()))
            .build();
    }

    /**
     * PUT /notifications/mark-all-read : Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> markAllNotificationsAsRead(Principal principal) {
        log.debug("REST request to mark all notifications as read for user: {}", principal.getName());
        
        String userId = principal.getName();
        notificationService.markAllAsRead(userId);
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("notifications.marked.read", userId))
            .build();
    }

    /**
     * DELETE /notifications/{id} : Delete notification
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete notification {} for user: {}", id, principal.getName());
        
        String userId = principal.getName();
        notificationService.deleteNotification(id, userId);
        
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert("notification", id.toString()))
            .build();
    }

    /**
     * POST /notifications/send : Send notification to user (Admin only)
     */
    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notification> sendNotification(@RequestBody NotificationRequest request) {
        log.debug("REST request to send notification to user: {}", request.getUserId());
        
        Notification notification = notificationService.sendNotification(
            request.getUserId(),
            request.getType(),
            request.getTitle(),
            request.getMessage(),
            request.getData(),
            request.getPriority()
        );
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("notification.sent", request.getUserId()))
            .body(notification);
    }

    /**
     * POST /notifications/broadcast : Send system notification to all users (Admin only)
     */
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> sendSystemNotification(@RequestBody BroadcastRequest request) {
        log.debug("REST request to send system notification: {}", request.getTitle());
        
        notificationService.sendSystemNotificationToAll(request.getTitle(), request.getMessage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "System notification sent to all users");
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /notifications/statistics : Get notification statistics (Admin only)
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationService.NotificationStatistics> getNotificationStatistics() {
        log.debug("REST request to get notification statistics");
        
        NotificationService.NotificationStatistics statistics = notificationService.getNotificationStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * POST /notifications/cleanup : Clean up old notifications (Admin only)
     */
    @PostMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> cleanupOldNotifications(
        @RequestParam(defaultValue = "30") int daysToKeep
    ) {
        log.debug("REST request to cleanup notifications older than {} days", daysToKeep);
        
        notificationService.cleanupOldNotifications(daysToKeep);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cleanup completed for notifications older than " + daysToKeep + " days");
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /notifications/cleanup-user : Clean up read notifications for user
     */
    @PostMapping("/cleanup-user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> cleanupUserReadNotifications(
        @RequestParam(defaultValue = "7") int daysToKeep,
        Principal principal
    ) {
        log.debug("REST request to cleanup read notifications for user: {}", principal.getName());
        
        String userId = principal.getName();
        notificationService.cleanupReadNotifications(userId, daysToKeep);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cleanup completed for read notifications older than " + daysToKeep + " days");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Notification request DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class NotificationRequest {
        private String userId;
        private NotificationType type;
        private String title;
        private String message;
        private String data;
        private String priority = "MEDIUM";
    }

    /**
     * Broadcast request DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class BroadcastRequest {
        private String title;
        private String message;
    }
}