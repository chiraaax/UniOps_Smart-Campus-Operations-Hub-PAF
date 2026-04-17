package com.uniops.demo.service;

import com.uniops.demo.model.Task;
import com.uniops.demo.model.User;
import com.uniops.demo.enums.TaskStatus;
import com.uniops.demo.repository.TaskRepository;
import com.uniops.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getPendingTasks() {
        return taskRepository.findByStatus(TaskStatus.PENDING);
    }

    public Task approveTask(String id) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(TaskStatus.APPROVED);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task rejectTask(String id) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(TaskStatus.REJECTED);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task assignTask(String taskId, String technicianId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setAssignedTechnicianId(technicianId);
        task.setStatus(TaskStatus.ASSIGNED);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public List<User> getAllTechnicians() {
        return userRepository.findAll().stream()
                .filter(user -> "TECHNICIAN".equals(user.getRole()))
                .collect(Collectors.toList());
    }
}
