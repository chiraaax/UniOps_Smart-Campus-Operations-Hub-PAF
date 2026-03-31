package com.uniops.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String location;

    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private FacilityType type;

    @Builder.Default
    @Column(nullable = false)
    private Boolean available = true;
}