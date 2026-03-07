package com.example.shubhvivah.profile.dto.RequestDto;

import com.example.shubhvivah.profile.enums.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    /* -------- Basic Details -------- */
    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @DecimalMin(value = "100.0", message = "Height must be at least 100 cm")
    @DecimalMax(value = "300.0", message = "Height must not exceed 300 cm")
    private BigDecimal height;

    @DecimalMin(value = "30.0", message = "Weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Weight must not exceed 300 kg")
    private BigDecimal weight;

    /* -------- Religious Details -------- */
    private Long religionId;
    private Long communityId;
    private Long casteId;
    private Long gotraId;

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
    private String city;

}
