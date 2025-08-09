package br.com.app.hpg.MindConnect.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "therapy_date_time_blocked")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TherapyDateTimeBlocked {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateHourInicio;
    private LocalDateTime dateHourFim;
    private Double valueForTherapy;
    private Boolean therapistApproved;
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_user_therapy", nullable = false)
    private UserTherapist therapist;
}
