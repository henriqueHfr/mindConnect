package br.com.app.hpg.MindConnect.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_therapist_id", nullable = false)
    private UserTherapist therapist;

    @ManyToOne
    @JoinColumn(name = "user_patient_id", nullable = false)
    private UserPatient patient;
}
