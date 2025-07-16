package com.surplus360.web.websocket;

import com.surplus360.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    
    // Track connected users
    private final Map<String, String> connectedUsers = new ConcurrentHashMap<>();

    /**
     * Handle user connection
     */
    @MessageMapping("/connect")
    @SendTo("/topic/users")
    public WebSocketMessage handleUserConnect(@Payload WebSocketMessage message, 
                                            SimpMessageHeaderAccessor headerAccessor) {
        Authentication auth = (Authentication) headerAccessor.getUser();
        if (auth != null) {
            String username = auth.getName();
            connectedUsers.put(headerAccessor.getSessionId(), username);
            
            log.debug("User connected: {} (session: {})", username, headerAccessor.getSessionId());
            
            // Notify others about user connection
            WebSocketMessage response = WebSocketMessage.builder()
                .type(MessageType.USER_CONNECTED)
                .from("system")
                .content(username + " connected")
                .timestamp(Instant.now())
                .build();
            
            return response;
        }
        return null;
    }

    /**
     * Handle user disconnection
     */
    @MessageMapping("/disconnect")
    @SendTo("/topic/users")
    public WebSocketMessage handleUserDisconnect(SimpMessageHeaderAccessor headerAccessor) {
        String username = connectedUsers.remove(headerAccessor.getSessionId());
        if (username != null) {
            log.debug("User disconnected: {} (session: {})", username, headerAccessor.getSessionId());
            
            WebSocketMessage response = WebSocketMessage.builder()
                .type(MessageType.USER_DISCONNECTED)
                .from("system")
                .content(username + " disconnected")
                .timestamp(Instant.now())
                .build();
            
            return response;
        }
        return null;
    }

    /**
     * Handle chat messages
     */
    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public WebSocketMessage handleChatMessage(@Payload WebSocketMessage message, Principal principal) {
        if (principal != null) {
            message.setFrom(principal.getName());
            message.setTimestamp(Instant.now());
            
            log.debug("Chat message from {}: {}", principal.getName(), message.getContent());
            
            return message;
        }
        return null;
    }

    /**
     * Handle private messages
     */
    @MessageMapping("/private")
    public void handlePrivateMessage(@Payload WebSocketMessage message, Principal principal) {
        if (principal != null && message.getTo() != null) {
            message.setFrom(principal.getName());
            message.setTimestamp(Instant.now());
            message.setType(MessageType.PRIVATE_MESSAGE);
            
            log.debug("Private message from {} to {}: {}", 
                     principal.getName(), message.getTo(), message.getContent());
            
            // Send to specific user
            messagingTemplate.convertAndSendToUser(
                message.getTo(), 
                "/queue/private", 
                message
            );
        }
    }

    /**
     * Handle product interest notifications
     */
    @MessageMapping("/product/interest")
    public void handleProductInterest(@Payload Map<String, Object> payload, Principal principal) {
        if (principal != null) {
            Long productId = Long.valueOf(payload.get("productId").toString());
            String productOwner = payload.get("productOwner").toString();
            
            log.debug("Product interest from {} for product {}", principal.getName(), productId);
            
            // Send notification to product owner
            WebSocketMessage message = WebSocketMessage.builder()
                .type(MessageType.PRODUCT_INTEREST)
                .from(principal.getName())
                .to(productOwner)
                .content("Someone is interested in your product")
                .data(payload)
                .timestamp(Instant.now())
                .build();
            
            messagingTemplate.convertAndSendToUser(
                productOwner, 
                "/queue/notifications", 
                message
            );
        }
    }

    /**
     * Handle transaction updates
     */
    @MessageMapping("/transaction/update")
    public void handleTransactionUpdate(@Payload Map<String, Object> payload, Principal principal) {
        if (principal != null) {
            String targetUser = payload.get("targetUser").toString();
            String transactionId = payload.get("transactionId").toString();
            String status = payload.get("status").toString();
            
            log.debug("Transaction update from {} to {} for transaction {}", 
                     principal.getName(), targetUser, transactionId);
            
            WebSocketMessage message = WebSocketMessage.builder()
                .type(MessageType.TRANSACTION_UPDATE)
                .from(principal.getName())
                .to(targetUser)
                .content("Transaction " + transactionId + " status updated to " + status)
                .data(payload)
                .timestamp(Instant.now())
                .build();
            
            messagingTemplate.convertAndSendToUser(
                targetUser, 
                "/queue/notifications", 
                message
            );
        }
    }

    /**
     * Handle typing indicators
     */
    @MessageMapping("/typing")
    public void handleTypingIndicator(@Payload Map<String, Object> payload, Principal principal) {
        if (principal != null) {
            String targetUser = payload.get("targetUser").toString();
            boolean isTyping = Boolean.parseBoolean(payload.get("isTyping").toString());
            
            WebSocketMessage message = WebSocketMessage.builder()
                .type(MessageType.TYPING_INDICATOR)
                .from(principal.getName())
                .to(targetUser)
                .content(isTyping ? "typing" : "stopped_typing")
                .timestamp(Instant.now())
                .build();
            
            messagingTemplate.convertAndSendToUser(
                targetUser, 
                "/queue/typing", 
                message
            );
        }
    }

    /**
     * Handle delivery status updates
     */
    @MessageMapping("/delivery/update")
    public void handleDeliveryUpdate(@Payload Map<String, Object> payload, Principal principal) {
        if (principal != null) {
            String targetUser = payload.get("targetUser").toString();
            String trackingNumber = payload.get("trackingNumber").toString();
            String status = payload.get("status").toString();
            
            log.debug("Delivery update from {} to {} for tracking {}", 
                     principal.getName(), targetUser, trackingNumber);
            
            WebSocketMessage message = WebSocketMessage.builder()
                .type(MessageType.DELIVERY_UPDATE)
                .from(principal.getName())
                .to(targetUser)
                .content("Delivery " + trackingNumber + " status: " + status)
                .data(payload)
                .timestamp(Instant.now())
                .build();
            
            messagingTemplate.convertAndSendToUser(
                targetUser, 
                "/queue/notifications", 
                message
            );
        }
    }

    /**
     * Get connected users count
     */
    @MessageMapping("/users/count")
    @SendTo("/topic/users/count")
    public Map<String, Object> getConnectedUsersCount() {
        return Map.of("count", connectedUsers.size());
    }

    /**
     * Broadcast system message
     */
    public void broadcastSystemMessage(String message) {
        log.debug("Broadcasting system message: {}", message);
        
        WebSocketMessage systemMessage = WebSocketMessage.builder()
            .type(MessageType.SYSTEM_MESSAGE)
            .from("system")
            .content(message)
            .timestamp(Instant.now())
            .build();
        
        messagingTemplate.convertAndSend("/topic/system", systemMessage);
    }

    /**
     * Send notification to specific user
     */
    public void sendNotificationToUser(String username, String title, String message, Object data) {
        log.debug("Sending notification to user {}: {}", username, title);
        
        WebSocketMessage notification = WebSocketMessage.builder()
            .type(MessageType.NOTIFICATION)
            .from("system")
            .to(username)
            .content(title)
            .data(Map.of("message", message, "data", data))
            .timestamp(Instant.now())
            .build();
        
        messagingTemplate.convertAndSendToUser(
            username, 
            "/queue/notifications", 
            notification
        );
    }

    /**
     * WebSocket message types
     */
    public enum MessageType {
        USER_CONNECTED,
        USER_DISCONNECTED,
        CHAT_MESSAGE,
        PRIVATE_MESSAGE,
        PRODUCT_INTEREST,
        TRANSACTION_UPDATE,
        DELIVERY_UPDATE,
        TYPING_INDICATOR,
        SYSTEM_MESSAGE,
        NOTIFICATION
    }

    /**
     * WebSocket message DTO
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class WebSocketMessage {
        private MessageType type;
        private String from;
        private String to;
        private String content;
        private Object data;
        private Instant timestamp;
    }
}