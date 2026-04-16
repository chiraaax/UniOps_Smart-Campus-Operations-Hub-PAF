package com.uniops.demo.service;

import com.uniops.demo.model.Task;
import com.uniops.demo.enums.TaskStatus;
import com.uniops.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TaskRepository taskRepository;

    public List<Task> getAssignedTasks(String technicianId) {
        return taskRepository.findByAssignedTechnicianId(technicianId);
    }

    public Task completeTask(String taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(TaskStatus.COMPLETED);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }
}
