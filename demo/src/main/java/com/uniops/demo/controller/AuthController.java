package com.uniops.demo.controller;

import com.uniops.demo.config.JwtUtils;
import com.uniops.demo.dto.LoginRequest;
import com.uniops.demo.model.User;
import com.uniops.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.auth.admin.username}")
    private String adminUsername;

    @org.springframework.beans.factory.annotation.Value("${app.auth.admin.password}")
    private String adminPassword;

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Check for Super Admin from properties
            if (adminUsername.equals(loginRequest.getEmail()) && adminPassword.equals(loginRequest.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                String jwt = jwtUtils.generateToken(adminUsername, "ADMIN");
                
                User adminUser = new User();
                adminUser.setEmail(adminUsername);
                adminUser.setName("System Admin");
                adminUser.setRole("ADMIN");
                adminUser.setStatus("APPROVED");

                response.put("token", jwt);
                response.put("user", adminUser);
                return ResponseEntity.ok(response);
            }

            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Check if password exists and matches
                if (user.getPassword() != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    
                    // Allow login for APPROVED users
                    // Also allow PENDING technicians to login (they can use the app but need admin approval for full access)
                    if ("REJECTED".equals(user.getStatus())) {
                        return ResponseEntity.status(403).body("Error: Your account has been rejected. Please contact administrator.");
                    }

                    String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", jwt);
                    response.put("user", user);
                    
                    // Add warning message if account is pending
                    if ("PENDING".equals(user.getStatus())) {
                        response.put("message", "Your account is pending administrator approval. Full access will be granted once approved.");
                    }
                    
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.status(401).body("Error: Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Auth error: " + e.getMessage());
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String accessToken = request.get("token");

        try {
            // 1. Verify token and get user info from Google
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> googleResponse = restTemplate.getForObject(
                    GOOGLE_USERINFO_URL + "?access_token=" + accessToken, Map.class);

            if (googleResponse == null || !googleResponse.containsKey("email")) {
                return ResponseEntity.status(401).body("Error: Invalid Google token");
            }

            String email = (String) googleResponse.get("email");
            String name = (String) googleResponse.get("name");
            String picture = (String) googleResponse.get("picture");
            String sub = (String) googleResponse.get("sub");

            // 2. Find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setProfilePicture(picture);
                newUser.setGoogleId(sub);
                newUser.setRole("STUDENT"); // Default role
                newUser.setStatus("APPROVED"); // Correctly set approved status
                return userRepository.save(newUser);
            });

            // 3. Check status (and handle potential null from existing users)
            if (user.getStatus() == null) {
                user.setStatus("APPROVED");
                userRepository.save(user);
            }
            if (!"APPROVED".equals(user.getStatus())) {
                return ResponseEntity.status(403).body("Error: Your account is " + user.getStatus());
            }

            // 4. Generate JWT
            String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", user);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Auth error: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Set default values
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }

        // Technicians need approval
        if ("TECHNICIAN".equals(user.getRole())) {
            user.setStatus("PENDING");
        } else {
            user.setStatus("APPROVED");
        }

        // Secure the password
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}
