package com.mindconnect.backend.controller;

import com.mindconnect.backend.model.User;
import com.mindconnect.backend.security.JwtUtil;
import com.mindconnect.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role", "patient");

        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "name,email,password required"));
        }

        try {
            User u = userService.register(name, email, password, role);
            String token = jwtUtil.generateToken(u.getId(), u.getRole());
            return ResponseEntity.ok(Map.of("token", token, "user", Map.of(
                    "id", u.getId(),
                    "name", u.getName(),
                    "email", u.getEmail(),
                    "role", u.getRole()
            )));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email,password required"));
        }

        return userService.findByEmail(email.toLowerCase())
                .map(user -> {
                    if (userService.checkPassword(user, password)) {
                        String token = jwtUtil.generateToken(user.getId(), user.getRole());
                        return ResponseEntity.ok(Map.of("token", token, "user", Map.of(
                                "id", user.getId(),
                                "name", user.getName(),
                                "email", user.getEmail(),
                                "role", user.getRole()
                        )));
                    } else {
                        return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "invalid_credentials")));
    }
}
