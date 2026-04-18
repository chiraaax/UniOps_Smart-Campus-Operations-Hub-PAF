package com.sliit.smartcampus.modules.user.model;

import com.sliit.smartcampus.common.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    private String email;
    private String name;
    private String pictureUrl; 
    
    // NEW FIELD: Needed for manual registration
    private String password; 
    
    private Role role;
}