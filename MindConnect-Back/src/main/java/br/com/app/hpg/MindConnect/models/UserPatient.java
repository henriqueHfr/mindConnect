package br.com.app.hpg.MindConnect.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "user_patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_type", nullable = false)
    private UserType userType;

    private String name;
    private String email;
    private String cpf;
    private String imagePerfil;
    private String descPerfil;
    private String location;
    private String reasonForTherapyQuestion1;
    private String reasonForTherapyQuestion2;
    private String reasonForTherapyQuestion3;
    private String reasonForTherapyQuestion4;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> chats;
}
