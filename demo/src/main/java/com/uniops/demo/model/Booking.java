package com.uniops.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String resourceName;
    private String purpose;
    private int attendees;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String userId;

    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String adminReason;
    private String qrCodeData; // Base64 encoded QR code image
}