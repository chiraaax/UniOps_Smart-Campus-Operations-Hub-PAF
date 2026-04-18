package com.sliit.smartcampus.modules.notification.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    private String userId; // Who receives this?
    private String title;
    private String message;
    
    private boolean isRead = false; // Defaults to unread
    private LocalDateTime createdAt = LocalDateTime.now();
}