package com.example.shubhvivah.profile.entity;

import com.example.shubhvivah.Authentication.Entity.UserEntity;
import com.example.shubhvivah.profile.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------- Relation -------- */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    /* -------- Basic Details -------- */

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate dateOfBirth;

    private BigDecimal height;

    private BigDecimal weight;

    /* -------- Religious Details -------- */

    private String religion;
    private String community;
    private String caste;
    private String gotra;

    @Enumerated(EnumType.STRING)
    private ManglikStatus manglikStatus;

    @Enumerated(EnumType.STRING)
    private Nakshatra nakshatra;

    @Enumerated(EnumType.STRING)
    private Rashi rashi;

    /* -------- Education & Work -------- */

    @Enumerated(EnumType.STRING)
    private Education education;

    @Enumerated(EnumType.STRING)
    private OccupationType occupation;

    @Enumerated(EnumType.STRING)
    private EmpType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "annual_income")
    private AnnualIncome annualIncome;

    /* -------- Family Details -------- */

    @Enumerated(EnumType.STRING)
    private OccupationType fatherOccupation;

    @Enumerated(EnumType.STRING)
    private OccupationType motherOccupation;

    private String fatherName;
    private String motherName;

    @Column(columnDefinition = "TEXT")
    private String aboutMe;

    @Enumerated(EnumType.STRING)
    private ProfileCreatedBy profileCreatedBy;

    private String subCaste;

    @Enumerated(EnumType.STRING)
    private DietPreference dietPreference;

    private Integer brothers;

    private Integer sisters;

    @Enumerated(EnumType.STRING)
    private FamilyType familyType;

    @Enumerated(EnumType.STRING)
    private FamilyStatus familyStatus;

    @Enumerated(EnumType.STRING)
    private FamilyValues familyValues;

    /* -------- Lifestyle -------- */

    @Enumerated(EnumType.STRING)
    private EatingHabit eatingHabit;

    @Enumerated(EnumType.STRING)
    private Habit drinkingHabit;

    @Enumerated(EnumType.STRING)
    private Habit smokingHabit;

    private String healthNote;

    /* -------- Matchmaking Fields -------- */
    private String city;

    private String profilePhotoUrl;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<ProfilePhotoEntity> photos = new java.util.ArrayList<>();

    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }
}
