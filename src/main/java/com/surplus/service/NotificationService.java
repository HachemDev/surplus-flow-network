package com.surplus.service;

import com.surplus.domain.Notification;
import com.surplus.domain.User;
import com.surplus.domain.enumeration.NotificationType;
import com.surplus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, NotificationType type, String title, String message) {
        return createNotification(user, type, title, message, null, "NORMAL");
    }

    public Notification createNotification(User user, NotificationType type, String title, String message, String data, String priority) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setData(data);
        notification.setPriority(priority);
        notification.setRead(false);
        
        return notificationRepository.save(notification);
    }

    public void notifyTransactionUpdate(User user, String transactionId, String status) {
        String title = "Transaction Update";
        String message = String.format("Your transaction #%s has been %s", transactionId, status.toLowerCase());
        createNotification(user, NotificationType.TRANSACTION_UPDATE, title, message, transactionId, "HIGH");
    }

    public void notifyNewRequest(User user, String productTitle) {
        String title = "New Request";
        String message = String.format("Someone is interested in your product: %s", productTitle);
        createNotification(user, NotificationType.NEW_REQUEST, title, message, null, "NORMAL");
    }

    public void notifySurplusMatch(User user, String productTitle) {
        String title = "Surplus Match Found";
        String message = String.format("We found a match for your interest in: %s", productTitle);
        createNotification(user, NotificationType.SURPLUS_MATCH, title, message, null, "HIGH");
    }

    public void notifyDeliveryUpdate(User user, String transactionId, String status) {
        String title = "Delivery Update";
        String message = String.format("Delivery status for transaction #%s: %s", transactionId, status);
        createNotification(user, NotificationType.DELIVERY_UPDATE, title, message, transactionId, "NORMAL");
    }

    public void notifySystemMessage(User user, String title, String message) {
        createNotification(user, NotificationType.SYSTEM, title, message, null, "NORMAL");
    }

    public void notifySystemMessageToAll(String title, String message) {
        // This would typically be implemented with a more efficient approach
        // For now, it's a placeholder for system-wide notifications
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(User user) {
        return notificationRepository.countUnreadByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserIdAndRead(user.getId(), false);
    }

    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId)
            .filter(notification -> notification.getUser().getId().equals(user.getId()))
            .ifPresent(notification -> {
                notification.setRead(true);
                notificationRepository.save(notification);
            });
    }

    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndRead(user.getId(), false);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}