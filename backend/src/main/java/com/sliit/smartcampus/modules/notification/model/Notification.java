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
    
    private String userId; 
    private String title;
    private String message;
    
    // --- NEW FIELDS FOR ENHANCEMENTS ---
    private String category = "GENERAL"; // e.g., BOOKING, TICKET
    private String referenceId; // The ID of the booking or ticket to navigate to
    
    private boolean isRead = false; 
    private LocalDateTime createdAt = LocalDateTime.now();
}