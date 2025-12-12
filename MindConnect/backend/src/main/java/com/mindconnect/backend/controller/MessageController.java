package com.mindconnect.backend.controller;

import com.mindconnect.backend.model.Match;
import com.mindconnect.backend.model.Message;
import com.mindconnect.backend.model.User;
import com.mindconnect.backend.repository.MatchRepository;
import com.mindconnect.backend.repository.MessageRepository;
import com.mindconnect.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matches/{matchId}/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MessageController(MessageRepository messageRepository, MatchRepository matchRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long matchId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Match> mOpt = matchRepository.findById(matchId);
        if (mOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "not_found"));
        Match match = mOpt.get();
        boolean allowed = match.getUser().getId().equals(userId) || match.getTherapist().getId().equals(userId);
        if (!allowed) return ResponseEntity.status(403).body(Map.of("error", "forbidden"));

        List<Message> messages = messageRepository.findByMatch_IdOrderByCreatedAtAsc(matchId);
        // Map to simple DTO
        var dto = messages.stream().map(msg -> Map.of(
                "id", msg.getId(),
                "text", msg.getText(),
                "createdAt", msg.getCreatedAt(),
                "sender", Map.of("id", msg.getSender().getId(), "name", msg.getSender().getName())
        )).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<?> create(@PathVariable Long matchId, @RequestBody Map<String, String> body) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "text required"));

        Optional<Match> mOpt = matchRepository.findById(matchId);
        if (mOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "not_found"));
        Match match = mOpt.get();
        boolean allowed = match.getUser().getId().equals(userId) || match.getTherapist().getId().equals(userId);
        if (!allowed) return ResponseEntity.status(403).body(Map.of("error", "forbidden"));

        User sender = userRepository.findById(userId).orElse(null);
        if (sender == null) return ResponseEntity.status(400).body(Map.of("error", "invalid_user"));

        Message msg = new Message();
        msg.setMatch(match);
        msg.setSender(sender);
        msg.setText(text);
        msg.setCreatedAt(Instant.now());
        messageRepository.save(msg);

        var dto = Map.of(
                "id", msg.getId(),
                "text", msg.getText(),
                "createdAt", msg.getCreatedAt(),
                "sender", Map.of("id", sender.getId(), "name", sender.getName())
        );

        return ResponseEntity.ok(dto);
    }
}
