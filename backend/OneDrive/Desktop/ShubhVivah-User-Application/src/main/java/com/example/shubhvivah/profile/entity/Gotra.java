package com.example.shubhvivah.profile.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gotras")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Gotra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caste_id", nullable = false)
    private Caste caste;

    @Column(name = "gotra_name", nullable = false)
    private String gotraName;

    @Column(nullable = false)
    private Boolean active;


}
