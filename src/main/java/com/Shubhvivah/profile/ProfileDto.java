
package com.Shubhvivah.profile;

import lombok.Data;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

@Data
public class ProfileDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Height is required")
    @Positive(message = "Height must be positive")
    private Double height;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weight;

    
    private String profilePhotoUrl;   // DP
    private List<String> additionalPhotos;

    // ✅ ADD THIS
    private String city;

    private String religion;
    private String community;
    private String caste;
    private String manglikStatus;
    private String gothra;
    private String nakshatra;
    private String rashi;

    private String highestEducation;
    private String employmentType;
    private String occupation;

    @PositiveOrZero(message = "Annual income cannot be negative")
    private Long annualIncome;

    private String fatherOccupation;
    private String motherOccupation;

    @PositiveOrZero
    private Integer brothers;

    @PositiveOrZero
    private Integer marriedBrothers;

    @PositiveOrZero
    private Integer sisters;

    @PositiveOrZero
    private Integer marriedSisters;

    private String familyType;
    private String familyStatus;
    private String familyValues;

    private String eatingHabits;
    private String dietPreference;
    private Boolean drinking;
    private Boolean smoking;

    @Size(max = 500)
    private String healthNotes;

    @Size(max = 1000)
    private String aboutMe;
}
