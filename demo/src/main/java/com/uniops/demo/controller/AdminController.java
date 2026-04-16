package com.uniops.demo.controller;

import com.uniops.demo.model.Task;
import com.uniops.demo.model.User;
import com.uniops.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;
    private final com.uniops.demo.repository.UserRepository userRepository;

    @GetMapping("/pending-tasks")
    public ResponseEntity<List<Task>> getPendingTasks() {
        return ResponseEntity.ok(adminService.getPendingTasks());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Task> approveTask(@PathVariable String id) {
        return ResponseEntity.ok(adminService.approveTask(id));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<Task> rejectTask(@PathVariable String id) {
        return ResponseEntity.ok(adminService.rejectTask(id));
    }

    @PutMapping("/assign/{taskId}/{technicianId}")
    public ResponseEntity<Task> assignTask(@PathVariable String taskId, @PathVariable String technicianId) {
        return ResponseEntity.ok(adminService.assignTask(taskId, technicianId));
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getAllTechnicians() {
        return ResponseEntity.ok(adminService.getAllTechnicians());
    }

    @GetMapping("/pending-technicians")
    public ResponseEntity<List<User>> getPendingTechnicians() {
        return ResponseEntity.ok(userRepository.findByRoleAndStatus("TECHNICIAN", "PENDING"));
    }

    @PutMapping("/approve-tech/{id}")
    public ResponseEntity<?> approveTechnician(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus("APPROVED");
        userRepository.save(user);
        return ResponseEntity.ok("Technician APPROVED!");
    }

    @PutMapping("/reject-tech/{id}")
    public ResponseEntity<?> rejectTechnician(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus("REJECTED");
        userRepository.save(user);
        return ResponseEntity.ok("Technician REJECTED!");
    }
}
