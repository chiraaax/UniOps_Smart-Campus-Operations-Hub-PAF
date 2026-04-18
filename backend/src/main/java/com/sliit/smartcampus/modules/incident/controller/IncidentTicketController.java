package com.sliit.smartcampus.modules.incident.controller;

import com.sliit.smartcampus.modules.incident.model.IncidentTicket;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import com.sliit.smartcampus.modules.incident.service.IncidentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
public class IncidentTicketController {

    @Autowired
    private IncidentTicketService service;

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@RequestBody IncidentTicket ticket) {
        return ResponseEntity.ok(service.createTicket(ticket));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(service.getAllTickets());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<IncidentTicket>> getUserTickets(@PathVariable String userId) {
        return ResponseEntity.ok(service.getTicketsByUser(userId));
    }

    @GetMapping("/technician/{techId}")
    public ResponseEntity<List<IncidentTicket>> getTechnicianTickets(@PathVariable String techId) {
        return ResponseEntity.ok(service.getTicketsByTechnician(techId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(service.getTicketById(id));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(service.getAnalytics());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateStatus(
            @PathVariable String id,
            @RequestParam TicketStatus status,
            @RequestParam(required = false) String resolutionNotes,
            @RequestParam(required = false) String technicianId,
            @RequestParam(required = false) String rejectedReason) {
        return ResponseEntity.ok(service.updateTicketStatus(id, status, resolutionNotes, technicianId, rejectedReason));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String projectRoot = System.getProperty("user.dir");
            String uploadDir = projectRoot + "/../frontend/public/incidentImages/";
            
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok("/incidentImages/" + fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<IncidentTicket> addComment(@PathVariable String id, @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String text = body.get("text");
        return ResponseEntity.ok(service.addComment(id, userId, text));
    }

    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<IncidentTicket> updateComment(
            @PathVariable String id, 
            @PathVariable String commentId, 
            @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String text = body.get("text");
        return ResponseEntity.ok(service.updateComment(id, commentId, userId, text));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<IncidentTicket> deleteComment(
            @PathVariable String id, 
            @PathVariable String commentId, 
            @RequestParam String userId,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(service.deleteComment(id, commentId, userId, role));
    }
}