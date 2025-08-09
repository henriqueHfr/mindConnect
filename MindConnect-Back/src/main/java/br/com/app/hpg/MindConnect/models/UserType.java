package br.com.app.hpg.MindConnect.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer accesPlataform;
}
