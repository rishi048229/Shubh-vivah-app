package com.example.shubhvivah.profile.entity;

import com.example.shubhvivah.profile.enums.PhotoType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile_photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilePhotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String photoUrl;

    // MAIN = profile pic, EXTRA = additional photos
    @Enumerated(EnumType.STRING)
    private PhotoType type;

    private Integer photoOrder; // optional (for arranging photos)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;
}