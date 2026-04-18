package com.uniops.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier; // email or username
    private String email;
    private String password;
}
