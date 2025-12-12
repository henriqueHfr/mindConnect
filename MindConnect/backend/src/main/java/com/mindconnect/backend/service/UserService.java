package com.mindconnect.backend.service;

import com.mindconnect.backend.model.User;
import com.mindconnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String name, String email, String rawPassword, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email.toLowerCase());
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(role == null ? "patient" : role);
        return userRepository.save(u);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    /**
     * Return all users. Used by controllers to filter therapists, etc.
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Update profile fields for a user. avatarUrl may be null to keep existing.
     */
    public User updateProfile(String userId, String name, String bio, String avatarUrl) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user_not_found"));
        if (name != null && !name.isBlank()) user.setName(name);
        if (bio != null) user.setBio(bio);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        user.setUpdatedAt(java.time.Instant.now());
        return userRepository.save(user);
    }
}
