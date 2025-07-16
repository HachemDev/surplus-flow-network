package com.surplus360.service;

import com.surplus360.domain.Notification;
import com.surplus360.domain.Product;
import com.surplus360.domain.enums.NotificationType;
import com.surplus360.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    /**
     * Send a notification to a user
     */
    public Notification sendNotification(String userId, NotificationType type, String title, String message) {
        return sendNotification(userId, type, title, message, null, "MEDIUM");
    }

    /**
     * Send a notification with data and priority
     */
    public Notification sendNotification(String userId, NotificationType type, String title, 
                                          String message, String data, String priority) {
        log.debug("Sending notification to user {} with type {}", userId, type);
        
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setData(data);
        notification.setPriority(priority);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        
        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendWebSocketNotification(userId, notification);
        
        // Send email notification for high priority notifications
        if ("HIGH".equals(priority)) {
            emailService.sendNotificationEmail(userId, title, message);
        }
        
        log.debug("Notification sent: {}", notification.getId());
        return notification;
    }

    /**
     * Get user notifications
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        log.debug("Getting notifications for user: {}", userId);
        return notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    /**
     * Get unread notifications
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUnreadNotifications(String userId, Pageable pageable) {
        log.debug("Getting unread notifications for user: {}", userId);
        return notificationRepository.findAllByUserIdAndReadIsFalse(userId, pageable);
    }

    /**
     * Get unread notification count
     */
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndReadIsFalse(userId);
    }

    /**
     * Mark notification as read
     */
    public void markAsRead(Long notificationId, String userId) {
        log.debug("Marking notification {} as read for user {}", notificationId, userId);
        
        notificationRepository.findById(notificationId)
            .filter(notification -> notification.getUserId().equals(userId))
            .ifPresent(notification -> {
                if (!notification.getRead()) {
                    notification.setRead(true);
                    notification.setReadAt(Instant.now());
                    notificationRepository.save(notification);
                    
                    // Send WebSocket update
                    sendWebSocketNotificationUpdate(userId, notification);
                }
            });
    }

    /**
     * Mark all notifications as read
     */
    public void markAllAsRead(String userId) {
        log.debug("Marking all notifications as read for user: {}", userId);
        
        notificationRepository.markAllAsRead(userId, Instant.now());
        
        // Send WebSocket update
        sendWebSocketNotificationUpdate(userId, null);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId, String userId) {
        log.debug("Deleting notification {} for user {}", notificationId, userId);
        
        notificationRepository.findById(notificationId)
            .filter(notification -> notification.getUserId().equals(userId))
            .ifPresent(notification -> {
                notificationRepository.delete(notification);
                
                // Send WebSocket update
                sendWebSocketNotificationUpdate(userId, null);
            });
    }

    /**
     * Notify about product matches
     */
    public void notifyProductMatches(Product product) {
        log.debug("Notifying about product matches for product: {}", product.getId());
        
        // This would typically involve finding users with matching interests
        // For now, we'll send a sample notification
        String data = String.format("{\"productId\": %d, \"category\": \"%s\"}", 
                                   product.getId(), product.getCategory());
        
        // You would implement logic to find interested users based on:
        // - Product category preferences
        // - Location preferences
        // - Price range preferences
        // - Tags/keywords they're following
        
        // Sample notification (in real implementation, this would be sent to relevant users)
        // sendNotification("interestedUserId", NotificationType.SURPLUS_MATCH, 
        //                 "New Product Match", "A new product matches your interests!", data, "MEDIUM");
    }

    /**
     * Notify product owner about interest
     */
    public void notifyProductInterest(Product product) {
        log.debug("Notifying product owner about interest: {}", product.getId());
        
        String data = String.format("{\"productId\": %d, \"title\": \"%s\"}", 
                                   product.getId(), product.getTitle());
        
        sendNotification(
            product.getOwner().getId().toString(),
            NotificationType.SURPLUS_MATCH,
            "Someone is interested in your product",
            "Your product '" + product.getTitle() + "' has received interest from another user.",
            data,
            "MEDIUM"
        );
    }

    /**
     * Notify about transaction updates
     */
    public void notifyTransactionUpdate(String userId, Long transactionId, String message) {
        log.debug("Notifying about transaction update: {}", transactionId);
        
        String data = String.format("{\"transactionId\": %d}", transactionId);
        
        sendNotification(
            userId,
            NotificationType.TRANSACTION_UPDATE,
            "Transaction Update",
            message,
            data,
            "HIGH"
        );
    }

    /**
     * Notify about delivery updates
     */
    public void notifyDeliveryUpdate(String userId, Long transactionId, String message) {
        log.debug("Notifying about delivery update: {}", transactionId);
        
        String data = String.format("{\"transactionId\": %d}", transactionId);
        
        sendNotification(
            userId,
            NotificationType.DELIVERY_UPDATE,
            "Delivery Update",
            message,
            data,
            "HIGH"
        );
    }

    /**
     * Send system notification
     */
    public void sendSystemNotification(String userId, String title, String message) {
        log.debug("Sending system notification to user: {}", userId);
        
        sendNotification(
            userId,
            NotificationType.SYSTEM,
            title,
            message,
            null,
            "LOW"
        );
    }

    /**
     * Send system notification to all users
     */
    public void sendSystemNotificationToAll(String title, String message) {
        log.debug("Sending system notification to all users");
        
        // In a real implementation, you would get all user IDs and send to each
        // This is a placeholder for broadcast functionality
        // userRepository.findAllUserIds().forEach(userId -> 
        //     sendSystemNotification(userId, title, message));
    }

    /**
     * Clean up old notifications
     */
    @Transactional
    public void cleanupOldNotifications(int daysToKeep) {
        log.debug("Cleaning up notifications older than {} days", daysToKeep);
        
        Instant cutoffDate = Instant.now().minusSeconds(daysToKeep * 24 * 60 * 60);
        notificationRepository.deleteAllByCreatedAtBefore(cutoffDate);
    }

    /**
     * Clean up read notifications for a user
     */
    @Transactional
    public void cleanupReadNotifications(String userId, int daysToKeep) {
        log.debug("Cleaning up read notifications for user {} older than {} days", userId, daysToKeep);
        
        Instant cutoffDate = Instant.now().minusSeconds(daysToKeep * 24 * 60 * 60);
        notificationRepository.deleteAllByUserIdAndReadIsTrueAndCreatedAtBefore(userId, cutoffDate);
    }

    /**
     * Get notification statistics
     */
    @Transactional(readOnly = true)
    public NotificationStatistics getNotificationStatistics() {
        log.debug("Getting notification statistics");
        
        return NotificationStatistics.builder()
            .totalNotifications(notificationRepository.count())
            .unreadNotifications(notificationRepository.findAll().stream()
                .mapToLong(n -> n.getRead() ? 0 : 1)
                .sum())
            .build();
    }

    /**
     * Send WebSocket notification
     */
    private void sendWebSocketNotification(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(userId, "/topic/notifications", notification);
            log.debug("WebSocket notification sent to user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification to user: {}", userId, e);
        }
    }

    /**
     * Send WebSocket notification update
     */
    private void sendWebSocketNotificationUpdate(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(userId, "/topic/notifications/update", notification);
            log.debug("WebSocket notification update sent to user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification update to user: {}", userId, e);
        }
    }

    /**
     * Notification statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class NotificationStatistics {
        private long totalNotifications;
        private long unreadNotifications;
    }
}