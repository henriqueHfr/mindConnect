package com.mindconnect.backend.repository;

import com.mindconnect.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_Id(String userId);
    List<Booking> findByTherapist_Id(String therapistId);
}
