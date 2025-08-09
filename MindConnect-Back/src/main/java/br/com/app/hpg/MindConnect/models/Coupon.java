package br.com.app.hpg.MindConnect.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coupon")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rule;
    private Double value;

    @ManyToOne
    @JoinColumn(name = "user_therapist_id", nullable = false)
    private UserTherapist userTherapist;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;
}
