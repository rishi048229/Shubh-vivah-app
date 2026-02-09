package com.Shubhvivah.profile;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

import com.Shubhvivah.auth.UserEntity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_profiles")
public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // =========================
    // PROFILE PHOTOS
    // =========================

    // Main profile photo (DP)
    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    // Additional photos
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfilePhotoEntity> photos = new ArrayList<>();


    // =========================
    // LOCATION (Hidden from User)
    // =========================

    private Double latitude;
    private Double longitude;


    /*
     * =========================
     * 1️⃣ BASIC DETAILS
     * =========================
     */
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private Double height;
    private Double weight;

    @Column(name = "city")
    private String city;


    /*
     * =========================
     * 2️⃣ RELIGIOUS DETAILS
     * =========================
     */
    private String religion;
    private String community;
    private String caste;
    private String manglikStatus;
    private String gothra;
    private String nakshatra;
    private String rashi;


    /*
     * =========================
     * 3️⃣ EDUCATION & CAREER
     * =========================
     */
    private String highestEducation;
    private String employmentType;
    private String occupation;
    private Long annualIncome;


    /*
     * =========================
     * 4️⃣ FAMILY DETAILS
     * =========================
     */
    private String fatherOccupation;
    private String motherOccupation;
    private Integer brothers;
    private Integer marriedBrothers;
    private Integer sisters;
    private Integer marriedSisters;
    private String familyType;
    private String familyStatus;
    private String familyValues;


    /*
     * =========================
     * 5️⃣ LIFESTYLE HABITS
     * =========================
     */
    private String eatingHabits;
    private String dietPreference;

    @Column(name = "is_drinking")
    private Boolean drinking;

    @Column(name = "is_smoking")
    private Boolean smoking;

    private String healthNotes;

    // =========================
    @Column(length = 1000)
    private String aboutMe;
}
