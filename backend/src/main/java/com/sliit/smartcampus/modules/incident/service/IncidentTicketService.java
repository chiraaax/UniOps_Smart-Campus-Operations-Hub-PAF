package com.sliit.smartcampus.modules.incident.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smartcampus.modules.incident.model.IncidentTicket;
import com.sliit.smartcampus.modules.incident.model.IncidentTicket.AuditLog;
import com.sliit.smartcampus.modules.incident.model.TicketComment;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import com.sliit.smartcampus.modules.incident.repository.IncidentTicketRepository;
import java.util.UUID;

@Service
public class IncidentTicketService {
    @Autowired
    private IncidentTicketRepository repository;

    public IncidentTicket createTicket(IncidentTicket ticket) {
        if(ticket.getAttachmentUrls() != null && ticket.getAttachmentUrls().size() > 3) {
            throw new IllegalArgumentException("Maximum of 3 attachments allowed.");
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

    public IncidentTicket getTicketById(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public IncidentTicket updateTicketStatus(String id, TicketStatus newStatus, String resolutionNotes, String technicianId, String rejectedReason) {
        IncidentTicket ticket = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (ticket.getStatus() != newStatus) {
            ticket.getAuditLogs().add(new AuditLog("Status changed to " + newStatus, "Admin"));
            ticket.setStatus(newStatus);
        }
        
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (technicianId != null && !technicianId.equals(ticket.getTechnicianId())) {
            ticket.setTechnicianId(technicianId);
            ticket.getAuditLogs().add(new AuditLog("Assigned to technician: " + technicianId, "Admin"));
        }
        
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);
        if (rejectedReason != null) ticket.setRejectedReason(rejectedReason);
        
        return repository.save(ticket);
    }

    public IncidentTicket addComment(String ticketId, String userId, String text) {
        IncidentTicket ticket = getTicketById(ticketId);
        
        TicketComment comment = new TicketComment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setText(text);
        comment.setTimestamp(LocalDateTime.now());
        
        ticket.getComments().add(comment);
        ticket.getAuditLogs().add(new AuditLog("Comment added", userId));
        ticket.setUpdatedAt(LocalDateTime.now());
        return repository.save(ticket);
    }

    public IncidentTicket updateComment(String ticketId, String commentId, String userId, String newText) {
        IncidentTicket ticket = getTicketById(ticketId);
        
        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        // Check ownership
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
        
        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Ownership or admin rule
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
        
        // Calculate MTTR for resolved/closed tickets
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