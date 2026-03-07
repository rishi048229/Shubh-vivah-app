package com.example.shubhvivah.profile.dto.ResponseDto;

import com.example.shubhvivah.profile.enums.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDto {

    private Long profileId;
    private Long userId;
    private String fullName;

    /* -------- Basic Details -------- */
    private Gender gender;
    private LocalDate dateOfBirth;
    private BigDecimal height;
    private BigDecimal weight;

    /* -------- Religious Details -------- */
    private String religion;

    private String community;

    private String caste;

    private String gotra;

    private ManglikStatus manglikStatus;
    private Nakshatra nakshatra;
    private Rashi rashi;

    /* -------- Education & Work -------- */
    private Education education;
    private OccupationType occupation;
    private EmpType employmentType;
    private AnnualIncome annualIncome;

    /* -------- Family Details -------- */
    private OccupationType fatherOccupation;
    private OccupationType motherOccupation;
    private String fatherName;
    private String motherName;

    private Integer brothers;
    private Integer sisters;
    private FamilyType familyType;
    private FamilyStatus familyStatus;
    private FamilyValues familyValues;

    /* -------- Lifestyle -------- */
    private EatingHabit eatingHabit;
    private DietPreference dietPreference;
    private Habit drinkingHabit;
    private Habit smokingHabit;
    private String healthNote;

    /* -------- Additional Details -------- */
    private String aboutMe;
    private ProfileCreatedBy profileCreatedBy;
    private String subCaste;

    /* -------- Matchmaking Fields -------- */
    private String city;
    private String profilePhotoUrl;
    private Double latitude;
    private Double longitude;
    private java.util.List<String> photos;

}
