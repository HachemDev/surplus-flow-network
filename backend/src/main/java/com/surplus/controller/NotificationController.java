package com.surplus.controller;

import com.surplus.domain.Notification;
import com.surplus.domain.User;
import com.surplus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/my-notifications")
    public ResponseEntity<?> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean read) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notifications;
        
        if (read != null) {
            notifications = notificationRepository.findByUserIdAndRead(user.getId(), read, pageable);
        } else {
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", notifications.getContent());
        response.put("totalElements", notifications.getTotalElements());
        response.put("totalPages", notifications.getTotalPages());
        response.put("size", notifications.getSize());
        response.put("number", notifications.getNumber());
        response.put("first", notifications.isFirst());
        response.put("last", notifications.isLast());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Long count = notificationRepository.countUnreadByUserId(user.getId());
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent() && notification.get().getUser().getId().equals(user.getId())) {
            Notification n = notification.get();
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
            notificationRepository.save(n);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndRead(user.getId(), false);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unreadNotifications);
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotification(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent() && notification.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(notification.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent() && notification.get().getUser().getId().equals(user.getId())) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}