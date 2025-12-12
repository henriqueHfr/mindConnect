package com.mindconnect.backend.repository;

import com.mindconnect.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByMatch_IdOrderByCreatedAtAsc(Long matchId);
}
