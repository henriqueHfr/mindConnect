package com.mindconnect.backend.controller;

import com.mindconnect.backend.model.Booking;
import com.mindconnect.backend.model.User;
import com.mindconnect.backend.repository.BookingRepository;
import com.mindconnect.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> myBookings() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Booking> list = bookingRepository.findByUser_Id(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String therapistId = (String) body.get("therapistId");
        String scheduledAt = (String) body.get("scheduledAt");
        Number priceN = (Number) body.getOrDefault("price", 0);

        if (therapistId == null || scheduledAt == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "therapistId and scheduledAt required"));
        }

        User user = userRepository.findById(userId).orElse(null);
        User therapist = userRepository.findById(therapistId).orElse(null);
        if (user == null || therapist == null) return ResponseEntity.badRequest().body(Map.of("error", "invalid_user_or_therapist"));

        Booking b = new Booking();
        b.setUser(user);
        b.setTherapist(therapist);
        b.setScheduledAt(Instant.parse(scheduledAt));
        b.setPrice(BigDecimal.valueOf(priceN.doubleValue()));
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }
}
