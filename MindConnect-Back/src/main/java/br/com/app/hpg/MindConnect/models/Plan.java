package br.com.app.hpg.MindConnect.models;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "plan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double value;
    private Integer quantityForTherapy;
    private String description;
    private Integer durationDays;
    private Boolean enabled;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Coupon> coupons;
}
