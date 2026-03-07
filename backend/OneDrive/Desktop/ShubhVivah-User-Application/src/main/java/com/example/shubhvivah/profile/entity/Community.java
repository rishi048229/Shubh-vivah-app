package com.example.shubhvivah.profile.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "communities")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "religion_id", nullable = false)
    private Religion religion;

    @Column(name = "community_name", nullable = false)
    private String communityName;

    @Column(nullable = false)
    private Boolean active;
}

