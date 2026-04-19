package com.sliit.smartcampus.modules.notification.service;

import com.sliit.smartcampus.modules.notification.model.Notification;
import com.sliit.smartcampus.modules.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // --- UPDATED CREATE LOGIC ---
    public Notification createNotification(String userId, String title, String message, String category, String referenceId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setCategory(category != null ? category : "GENERAL");
        notification.setReferenceId(referenceId);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().filter(n -> !n.isRead()).toList();
        
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // --- NEW: DELETE LOGIC ---
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}