package com.sliit.smartcampus.modules.incident.model;

import com.sliit.smartcampus.modules.incident.model.enums.TicketPriority;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "incident_tickets")
public class IncidentTicket {
    @Id
    private String id;
    private String resourceId; // Links to Module A (Facilities)
    private String reportedByUserId; // User who created the ticket
    private String category;
    private String description;
    private TicketPriority priority;
    private String contactDetails;

    private List<String> attachmentUrls = new ArrayList<>(); // Max 3 attachments

    private TicketStatus status = TicketStatus.OPEN;
    private String technicianId; // Nullable until assigned
    private String resolutionNotes;
    private String rejectedReason;

    private List<TicketComment> comments = new ArrayList<>();
    private List<AuditLog> auditLogs = new ArrayList<>(); // Track history

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // --- NEW: SLA TIMERS ---
    private LocalDateTime firstRespondedAt; // When it was first answered/assigned
    private LocalDateTime resolvedAt; // When it was fixed

    @Data
    public static class AuditLog {
        private LocalDateTime timestamp;
        private String action;
        private String user;

        public AuditLog() {
        }

        public AuditLog(String action, String user) {
            this.action = action;
            this.user = user;
            this.timestamp = LocalDateTime.now();
        }
    }
}