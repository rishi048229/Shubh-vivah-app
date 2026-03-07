package com.example.shubhvivah.profile.service;

import com.example.shubhvivah.Authentication.Entity.UserEntity;
import com.example.shubhvivah.profile.dto.RequestDto.UserProfileRequestDto;
import com.example.shubhvivah.profile.dto.ResponseDto.UserProfileResponseDto;
import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.Authentication.Repository.UserRepository;
import com.example.shubhvivah.profile.repository.ReligionRepository;
import com.example.shubhvivah.profile.repository.CommunityRepository;
import com.example.shubhvivah.profile.repository.CasteRepository;
import com.example.shubhvivah.profile.repository.GotraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfileMapper {

        private final UserRepository userRepository;
        private final ReligionRepository religionRepository;
        private final CommunityRepository communityRepository;
        private final CasteRepository casteRepository;
        private final GotraRepository gotraRepository;

        public UserProfile toEntity(UserProfileRequestDto dto) {
                UserEntity user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

                return UserProfile.builder()
                                .user(user)
                                .gender(dto.getGender())
                                .dateOfBirth(dto.getDateOfBirth())
                                .height(dto.getHeight())
                                .weight(dto.getWeight())
                                .religion(dto.getReligionId() != null
                                                ? religionRepository.findById(dto.getReligionId()).orElse(null)
                                                : null)
                                .community(
                                                dto.getCommunityId() != null
                                                                ? communityRepository.findById(dto.getCommunityId())
                                                                                .orElse(null)
                                                                : null)
                                .caste(dto.getCasteId() != null
                                                ? casteRepository.findById(dto.getCasteId()).orElse(null)
                                                : null)
                                .gotra(dto.getGotraId() != null
                                                ? gotraRepository.findById(dto.getGotraId()).orElse(null)
                                                : null)
                                .manglikStatus(dto.getManglikStatus())
                                .nakshatra(dto.getNakshatra())
                                .rashi(dto.getRashi())
                                .education(dto.getEducation())
                                .occupation(dto.getOccupation())
                                .employmentType(dto.getEmploymentType())
                                .annualIncome(dto.getAnnualIncome())
                                .fatherOccupation(dto.getFatherOccupation())
                                .motherOccupation(dto.getMotherOccupation())
                                .fatherName(dto.getFatherName())
                                .motherName(dto.getMotherName())
                                .aboutMe(dto.getAboutMe())
                                .profileCreatedBy(dto.getProfileCreatedBy())
                                .subCaste(dto.getSubCaste())
                                .dietPreference(dto.getDietPreference())
                                .brothers(dto.getBrothers())
                                .sisters(dto.getSisters())
                                .familyType(dto.getFamilyType())
                                .familyStatus(dto.getFamilyStatus())
                                .familyValues(dto.getFamilyValues())
                                .eatingHabit(dto.getEatingHabit())
                                .drinkingHabit(dto.getDrinkingHabit())
                                .smokingHabit(dto.getSmokingHabit())
                                .healthNote(dto.getHealthNote())
                                .build();
        }

        public UserProfileResponseDto toResponseDto(UserProfile entity) {
                return UserProfileResponseDto.builder()
                                .profileId(entity.getId())
                                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                                .fullName(entity.getUser() != null ? entity.getUser().getFullName() : null)
                                .gender(entity.getGender())
                                .dateOfBirth(entity.getDateOfBirth())
                                .height(entity.getHeight())
                                .weight(entity.getWeight())
                                .religionId(entity.getReligion() != null ? entity.getReligion().getId() : null)
                                .religion(entity.getReligion() != null ? entity.getReligion().getReligionName() : null)
                                .communityId(entity.getCommunity() != null ? entity.getCommunity().getId() : null)
                                .community(entity.getCommunity() != null ? entity.getCommunity().getCommunityName()
                                                : null)
                                .casteId(entity.getCaste() != null ? entity.getCaste().getId() : null)
                                .caste(entity.getCaste() != null ? entity.getCaste().getCasteName() : null)
                                .gotraId(entity.getGotra() != null ? entity.getGotra().getId() : null)
                                .gotra(entity.getGotra() != null ? entity.getGotra().getGotraName() : null)
                                .manglikStatus(entity.getManglikStatus())
                                .nakshatra(entity.getNakshatra())
                                .rashi(entity.getRashi())
                                .education(entity.getEducation())
                                .occupation(entity.getOccupation())
                                .employmentType(entity.getEmploymentType())
                                .annualIncome(entity.getAnnualIncome())
                                .fatherOccupation(entity.getFatherOccupation())
                                .motherOccupation(entity.getMotherOccupation())
                                .fatherName(entity.getFatherName())
                                .motherName(entity.getMotherName())
                                .aboutMe(entity.getAboutMe())
                                .profileCreatedBy(entity.getProfileCreatedBy())
                                .subCaste(entity.getSubCaste())
                                .dietPreference(entity.getDietPreference())
                                .brothers(entity.getBrothers())
                                .sisters(entity.getSisters())
                                .familyType(entity.getFamilyType())
                                .familyStatus(entity.getFamilyStatus())
                                .familyValues(entity.getFamilyValues())
                                .eatingHabit(entity.getEatingHabit())
                                .drinkingHabit(entity.getDrinkingHabit())
                                .smokingHabit(entity.getSmokingHabit())
                                .healthNote(entity.getHealthNote())
                                .city(entity.getCity())
                                .latitude(entity.getLatitude())
                                .longitude(entity.getLongitude())
                                .profilePhotoUrl(entity.getPhotos() != null ? entity.getPhotos().stream()
                                                .filter(p -> p.getType() == com.example.shubhvivah.profile.enums.PhotoType.MAIN)
                                                .map(com.example.shubhvivah.profile.entity.ProfilePhotoEntity::getPhotoUrl)
                                                .findFirst()
                                                .orElse(entity.getProfilePhotoUrl()) : entity.getProfilePhotoUrl())
                                .photos(entity.getPhotos() != null ? entity.getPhotos().stream()
                                                .map(com.example.shubhvivah.profile.entity.ProfilePhotoEntity::getPhotoUrl)
                                                .collect(java.util.stream.Collectors.toList()) : null)
                                .build();
        }
}
