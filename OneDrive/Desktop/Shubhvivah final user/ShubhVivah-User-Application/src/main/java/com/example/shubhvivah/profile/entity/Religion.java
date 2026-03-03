package com.example.shubhvivah.profile.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "religions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Religion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "religion_name", nullable = false)
    private String religionName;

    @Column(nullable = false)
    private Boolean active;
}
