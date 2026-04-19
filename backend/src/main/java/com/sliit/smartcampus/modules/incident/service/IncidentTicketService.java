package com.sliit.smartcampus.modules.incident.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smartcampus.modules.incident.model.IncidentTicket;
import com.sliit.smartcampus.modules.incident.model.IncidentTicket.AuditLog;
import com.sliit.smartcampus.modules.incident.model.TicketComment;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import com.sliit.smartcampus.modules.incident.repository.IncidentTicketRepository;
import com.sliit.smartcampus.modules.notification.service.NotificationService;

@Service
public class IncidentTicketService {
    @Autowired
    private IncidentTicketRepository repository;
    
    @Autowired
    private NotificationService notificationService;

    public IncidentTicket createTicket(IncidentTicket ticket) {
        if(ticket.getAttachmentUrls() != null && ticket.getAttachmentUrls().size() > 3) {
            throw new IllegalArgumentException("Maximum of 3 attachments allowed.");
        }
        // SAFTEY CHECK
        if (ticket.getAuditLogs() == null) {
            ticket.setAuditLogs(new ArrayList<>());
        }
        ticket.getAuditLogs().add(new AuditLog("Ticket Created", ticket.getReportedByUserId() != null ? ticket.getReportedByUserId() : "System"));
        return repository.save(ticket);
    }

    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    public List<IncidentTicket> getTicketsByUser(String userId) {
        return repository.findByReportedByUserId(userId);
    }

    public List<IncidentTicket> getTicketsByTechnician(String technicianId) {
        return repository.findByTechnicianId(technicianId);
    }

    public IncidentTicket getTicketById(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public IncidentTicket updateTicketStatus(String id, TicketStatus newStatus, String resolutionNotes, String technicianId, String rejectedReason) {
        IncidentTicket ticket = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // SAFTEY CHECK
        if (ticket.getAuditLogs() == null) {
            ticket.setAuditLogs(new ArrayList<>());
        }

        if (ticket.getStatus() != newStatus) {
            ticket.getAuditLogs().add(new AuditLog("Status changed to " + newStatus, "Admin/Tech"));
            ticket.setStatus(newStatus);
            
            if (newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED) {
                if (ticket.getResolvedAt() == null) {
                    ticket.setResolvedAt(LocalDateTime.now());
                }
            }
            
            if (newStatus == TicketStatus.IN_PROGRESS && ticket.getFirstRespondedAt() == null) {
                ticket.setFirstRespondedAt(LocalDateTime.now());
            }

            if (ticket.getReportedByUserId() != null) {
                String title = "Ticket Update: " + newStatus.name();
                String message = "Your incident report for " + (ticket.getCategory() != null ? ticket.getCategory() : "Resource") + " is now " + newStatus.name() + ".";
                notificationService.createNotification(ticket.getReportedByUserId(), title, message, "TICKET", ticket.getId());
            }
        }
        
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (technicianId != null && !technicianId.equals(ticket.getTechnicianId())) {
            ticket.setTechnicianId(technicianId);
            ticket.getAuditLogs().add(new AuditLog("Assigned to technician: " + technicianId, "Admin"));
            
            if (ticket.getFirstRespondedAt() == null) {
                ticket.setFirstRespondedAt(LocalDateTime.now());
            }
        }
        
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);
        if (rejectedReason != null) ticket.setRejectedReason(rejectedReason);
        
        return repository.save(ticket);
    }

    public IncidentTicket addComment(String ticketId, String userId, String text) {
        IncidentTicket ticket = getTicketById(ticketId);
        
        if (ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(LocalDateTime.now());
        }
        
        TicketComment comment = new TicketComment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setText(text);
        comment.setTimestamp(LocalDateTime.now());
        
        // --- BULLETPROOF SAFTEY CHECKS ---
        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }
        ticket.getComments().add(comment);

        if (ticket.getAuditLogs() == null) {
            ticket.setAuditLogs(new ArrayList<>());
        }
        ticket.getAuditLogs().add(new AuditLog("Comment added", userId));
        // ----------------------------------

        ticket.setUpdatedAt(LocalDateTime.now());

        if (ticket.getReportedByUserId() != null && !userId.equals(ticket.getReportedByUserId())) {
            String title = "New Reply on Ticket";
            String message = "A new comment was added to your incident ticket.";
            notificationService.createNotification(ticket.getReportedByUserId(), title, message, "TICKET", ticket.getId());
        }

        return repository.save(ticket);
    }

    public IncidentTicket updateComment(String ticketId, String commentId, String userId, String newText) {
        IncidentTicket ticket = getTicketById(ticketId);
        
        if (ticket.getComments() == null) return ticket;

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to update this comment");
        }
        
        comment.setText(newText);
        comment.setTimestamp(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        return repository.save(ticket);
    }

    public IncidentTicket deleteComment(String ticketId, String commentId, String userId, String role) {
        IncidentTicket ticket = getTicketById(ticketId);
        
        if (ticket.getComments() == null) return ticket;

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId) && !"ADMIN".equals(role)) {
            throw new RuntimeException("User not authorized to delete this comment");
        }
        
        ticket.getComments().removeIf(c -> c.getId().equals(commentId));
        ticket.setUpdatedAt(LocalDateTime.now());
        return repository.save(ticket);
    }

    public Map<String, Object> getAnalytics() {
        List<IncidentTicket> all = repository.findAll();
        
        long total = all.size();
        long active = all.stream().filter(t -> t.getStatus() != TicketStatus.RESOLVED && t.getStatus() != TicketStatus.CLOSED && t.getStatus() != TicketStatus.REJECTED).count();
        
        List<IncidentTicket> resolved = all.stream()
                .filter(t -> t.getStatus() == TicketStatus.RESOLVED || t.getStatus() == TicketStatus.CLOSED)
                .toList();
                
        double avgHoursToResolve = 0;
        if (!resolved.isEmpty()) {
            long totalMinutes = 0;
            for (IncidentTicket t : resolved) {
                if (t.getCreatedAt() != null && t.getUpdatedAt() != null) {
                    totalMinutes += java.time.Duration.between(t.getCreatedAt(), t.getUpdatedAt()).toMinutes();
                }
            }
            avgHoursToResolve = (double) totalMinutes / 60.0 / resolved.size();
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", total);
        stats.put("activeTickets", active);
        stats.put("avgHoursToResolve", Math.round(avgHoursToResolve * 10.0) / 10.0);
        
        return stats;
    }
}