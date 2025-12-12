package com.mindconnect.backend.controller;

import com.mindconnect.backend.model.User;
import com.mindconnect.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((User) java.util.Map.of("error", "User not found")));
    }

    @GetMapping("/therapists")
    public ResponseEntity<?> therapists() {
        List<User> list = userService.findAll().stream()
                .filter(u -> "therapist".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((User) java.util.Map.of("error", "User not found")));
    }

    @PutMapping(value = "/me", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateMe(@RequestParam(value = "name", required = false) String name,
                                      @RequestParam(value = "bio", required = false) String bio,
                                      @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            String avatarUrl = null;
            if (avatar != null && !avatar.isEmpty()) {
                // Ensure uploads directory exists
                Path uploadsDir = Path.of("uploads").toAbsolutePath();
                Files.createDirectories(uploadsDir);

                String ext = "";
                String original = avatar.getOriginalFilename();
                if (original != null && original.contains(".")) {
                    ext = original.substring(original.lastIndexOf('.'));
                }
                String filename = UUID.randomUUID().toString() + ext;
                Path target = uploadsDir.resolve(filename);
                Files.copy(avatar.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                avatarUrl = "/uploads/" + filename;
            }

            User updated = userService.updateProfile(userId, name, bio, avatarUrl);
            return ResponseEntity.ok(updated);
        } catch (IOException ex) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "upload_failed"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }
}
