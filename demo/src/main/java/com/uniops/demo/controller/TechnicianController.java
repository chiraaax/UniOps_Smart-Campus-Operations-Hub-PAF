package com.uniops.demo.controller;

import com.uniops.demo.model.Task;
import com.uniops.demo.service.TechnicianService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technician")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TechnicianController {

    private final TechnicianService technicianService;

    @GetMapping("/tasks/{technicianId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable String technicianId) {
        return ResponseEntity.ok(technicianService.getAssignedTasks(technicianId));
    }

    @PutMapping("/complete/{taskId}")
    public ResponseEntity<Task> completeTask(@PathVariable String taskId) {
        return ResponseEntity.ok(technicianService.completeTask(taskId));
    }
}
