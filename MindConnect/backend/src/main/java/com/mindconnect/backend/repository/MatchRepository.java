package com.mindconnect.backend.repository;

import com.mindconnect.backend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByUser_Id(String userId);
    List<Match> findByTherapist_Id(String therapistId);
}
