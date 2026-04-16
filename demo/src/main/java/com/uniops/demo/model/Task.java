package com.uniops.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.uniops.demo.enums.TaskStatus;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String resourceId;
    private String issueDescription;
    private TaskStatus status; // PENDING, APPROVED, REJECTED, ASSIGNED, COMPLETED
    private String assignedTechnicianId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
