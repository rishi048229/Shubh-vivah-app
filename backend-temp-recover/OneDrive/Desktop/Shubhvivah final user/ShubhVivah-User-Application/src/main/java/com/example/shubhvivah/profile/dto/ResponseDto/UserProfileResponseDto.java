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

        /* -------- Basic Details -------- */
        private Gender gender;
        private LocalDate dateOfBirth;
        private BigDecimal height;
        private BigDecimal weight;

        /* -------- Religious Details -------- */
        private Long religionId;
        private String religion;

        private Long communityId;
        private String community;

        private Long casteId;
        private String caste;

        private Long gotraId;
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
        private Integer brothers;
        private Integer sisters;
        private FamilyType familyType;
        private FamilyStatus familyStatus;
        private FamilyValues familyValues;

        /* -------- Lifestyle -------- */
        private EatingHabit eatingHabit;
        private Habit drinkingHabit;
        private Habit smokingHabit;
        private String healthNote;

}
