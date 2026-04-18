package com.uniops.demo.controller;

import com.uniops.demo.config.JwtUtils;
import com.uniops.demo.dto.LoginRequest;
import com.uniops.demo.model.User;
import com.uniops.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

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

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String identifier = loginRequest.getIdentifier();
            if (identifier == null || identifier.isBlank()) {
                identifier = loginRequest.getEmail(); // backward compatibility
            }

            if (identifier == null || identifier.isBlank() ||
                    loginRequest.getPassword() == null || loginRequest.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("Error: Identifier and password are required");
            }

            String normalizedIdentifier = identifier.trim();
            String adminAlias = adminUsername != null && adminUsername.contains("@")
                    ? adminUsername.substring(0, adminUsername.indexOf('@'))
                    : adminUsername;

            // Check for Super Admin from properties
            if ((adminUsername.equalsIgnoreCase(normalizedIdentifier) ||
                    (adminAlias != null && adminAlias.equalsIgnoreCase(normalizedIdentifier)))
                    && adminPassword.equals(loginRequest.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                String jwt = jwtUtils.generateToken(adminUsername, "ADMIN");
                
                User adminUser = new User();
                adminUser.setEmail(adminUsername);
                adminUser.setUsername(adminAlias);
                adminUser.setName("System Admin");
                adminUser.setRole("ADMIN");
                adminUser.setStatus("APPROVED");

                response.put("token", jwt);
                response.put("user", adminUser);
                return ResponseEntity.ok(response);
            }

            Optional<User> userOptional;
            if (EMAIL_PATTERN.matcher(normalizedIdentifier).matches()) {
                userOptional = userRepository.findByEmail(normalizedIdentifier);
            } else {
                userOptional = userRepository.findByUsername(normalizedIdentifier);
            }
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // For ADMIN or TECHNICIAN, we might want to allow normal password login
                // Check if password exists and matches
                if (user.getPassword() != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    
                    if (!"APPROVED".equals(user.getStatus())) {
                        return ResponseEntity.status(403).body("Error: Your account is " + user.getStatus());
                    }

                    String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", jwt);
                    response.put("user", user);
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
        String idToken = request.get("token");

        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body("Error: Missing Google token");
        }

        try {
            // 1. Verify the ID token with Google's tokeninfo endpoint
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> googleResponse = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken, Map.class);

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
                newUser.setUsername(generateUsernameFromEmail(email));
                newUser.setProfilePicture(picture);
                newUser.setGoogleId(sub);
                newUser.setRole("STUDENT"); // Default role
                newUser.setStatus("APPROVED"); // Approved by default for Google users
                return userRepository.save(newUser);
            });

            if (user.getStatus() == null) {
                user.setStatus("APPROVED");
                userRepository.save(user);
            }
            if (!"APPROVED".equals(user.getStatus())) {
                return ResponseEntity.status(403).body("Error: Your account is " + user.getStatus());
            }

            // 3. Generate JWT
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
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Error: Username is required!");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already in use!");
        }

        // Set default values
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Error: Admin accounts cannot be created via sign up");
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

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }
}
