package com.sliit.smartcampus.modules.notification.repository;

import com.sliit.smartcampus.modules.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    // Fetch notifications for a user, newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}