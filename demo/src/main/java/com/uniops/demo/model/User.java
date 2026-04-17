package com.uniops.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // e.g., STUDENT, ADMIN, TECHNICIAN
    private String department;
    private String status; // PENDING, APPROVED, REJECTED (for Technicians)
    private String profilePicture;
    private String googleId;
}
