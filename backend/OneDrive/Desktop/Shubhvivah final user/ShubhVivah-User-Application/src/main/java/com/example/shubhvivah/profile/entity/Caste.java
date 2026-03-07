package com.example.shubhvivah.profile.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Entity
@Table(name = "castes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Caste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @Column(name = "caste_name", nullable = false)
    private String casteName;   // 96 Kuli, Deshastha, etc.

    @Column(nullable = false)
    private boolean active;
    @OneToMany(mappedBy = "caste")
    private Collection<Gotra> gotra;


}
