package com.mindconnect.backend.controller;

import com.mindconnect.backend.model.Match;
import com.mindconnect.backend.model.User;
import com.mindconnect.backend.repository.MatchRepository;
import com.mindconnect.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchController(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> myMatches() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Match> list = matchRepository.findByUser_Id(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String therapistId = (String) body.get("therapistId");
        if (therapistId == null) return ResponseEntity.badRequest().body(Map.of("error", "therapistId required"));

        User user = userRepository.findById(userId).orElse(null);
        User therapist = userRepository.findById(therapistId).orElse(null);
        if (user == null || therapist == null) return ResponseEntity.badRequest().body(Map.of("error", "invalid_user_or_therapist"));

        // prevent duplicate
        List<Match> existing = matchRepository.findByUser_Id(userId);
        boolean dup = existing.stream().anyMatch(m -> m.getTherapist().getId().equals(therapistId));
        if (dup) return ResponseEntity.badRequest().body(Map.of("error", "already_matched"));

        Match m = new Match();
        m.setUser(user);
        m.setTherapist(therapist);
        matchRepository.save(m);
        return ResponseEntity.ok(m);
    }
}
