package com.uniops.demo.repository;

import com.uniops.demo.model.Task;
import com.uniops.demo.enums.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedTechnicianId(String technicianId);
}
