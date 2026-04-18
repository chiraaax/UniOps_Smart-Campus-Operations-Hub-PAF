package com.sliit.smartcampus.modules.incident.service;

import com.sliit.smartcampus.modules.incident.model.IncidentTicket;
import com.sliit.smartcampus.modules.incident.model.IncidentTicket.AuditLog;
import com.sliit.smartcampus.modules.incident.model.enums.TicketPriority;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import com.sliit.smartcampus.modules.incident.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledEscalationService {

    @Autowired
    private IncidentTicketRepository repository;

    // Run every 2 minutes for demonstration purposes. In production, maybe daily.
    @Scheduled(fixedRate = 120000)
    public void escalateOverdueTickets() {
        List<IncidentTicket> tickets = repository.findAll();
        
        for (IncidentTicket ticket : tickets) {
            if (ticket.getStatus() == TicketStatus.OPEN && 
               (ticket.getPriority() == TicketPriority.CRITICAL || ticket.getPriority() == TicketPriority.HIGH)) {
                   
                // If it's been OPEN for more than 5 minutes (for demo assignment purposes)
                if (ticket.getCreatedAt() != null && ticket.getCreatedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
                    // Check if already escalated
                    boolean alreadyEscalated = ticket.getAuditLogs().stream()
                            .anyMatch(log -> "SYSTEM_ESCALATION".equals(log.getAction()));
                            
                    if (!alreadyEscalated) {
                        ticket.getAuditLogs().add(new AuditLog("SYSTEM_ESCALATION", "AutoEscalateService"));
                        ticket.setResolutionNotes("[ESCALATED - OVERDUE] " + (ticket.getResolutionNotes() != null ? ticket.getResolutionNotes() : ""));
                        ticket.setUpdatedAt(LocalDateTime.now());
                        repository.save(ticket);
                        System.out.println("Escalated ticket ID: " + ticket.getId());
                    }
                }
            }
        }
    }
}
