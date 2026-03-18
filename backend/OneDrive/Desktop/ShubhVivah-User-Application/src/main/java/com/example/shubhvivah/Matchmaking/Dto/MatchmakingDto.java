package com.example.shubhvivah.Matchmaking.Dto;

import lombok.Data;
import java.util.List;

@Data
public class MatchmakingDto {

    private Long userId;
    private String fullName;

    private int age;
    private String city;
    private String religion;

    private double matchScore;

    private String profilePhotoUrl;
    private List<String> photos;

    // Raw distance in KM (for logic if needed)
    private Double distanceKm;

    // Formatted text for UI -> "5 km away"
    private String distanceText;

    /* -------- Detail fields for full profile view -------- */
    private String gender;
    private String occupation;
    private String education;
    private String income;
    private String height;
    private String community;
    private String caste;
    private String subCaste;
    private String gotra;
    private String aboutMe;

    // Family
    private String fatherName;
    private String fatherOccupation;
    private String motherName;
    private String motherOccupation;
    private Integer brothers;
    private Integer sisters;
    private String familyType;
    private String familyStatus;
    private String familyValues;

    // Horoscope
    private String manglikStatus;
    private String dateOfBirth;
    private String rashi;
    private String nakshatra;

    // Lifestyle
    private String dietPreference;
    private String eatingHabit;
    private String smokingHabit;
    private String drinkingHabit;
}
