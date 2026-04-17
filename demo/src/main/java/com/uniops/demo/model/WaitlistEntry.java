package com.uniops.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "waitlist")
public class WaitlistEntry {

    @Id
    private String id;
    private String resourceName;
    private String userId;
    private String status; // WAITING, NOTIFIED, CLAIMED, EXPIRED, CANCELLED
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime notifiedAt;
    private LocalDateTime expiresAt;
}
