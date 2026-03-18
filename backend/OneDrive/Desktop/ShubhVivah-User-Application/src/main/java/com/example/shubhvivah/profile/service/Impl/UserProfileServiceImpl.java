package com.example.shubhvivah.profile.service.Impl;

import com.example.shubhvivah.profile.dto.RequestDto.UserProfileRequestDto;
import com.example.shubhvivah.profile.dto.ResponseDto.UserProfileResponseDto;
import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.profile.repository.UserProfileRepository;
import com.example.shubhvivah.profile.service.ProfileMapper;
import com.example.shubhvivah.profile.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    public UserProfileResponseDto saveOrUpdateProfile(UserProfileRequestDto userProfileRequestDto) {
        Optional<UserProfile> existingProfileOpt = userProfileRepository
                .findByUser_UserId(userProfileRequestDto.getUserId());

        UserProfile userProfile;
        if (existingProfileOpt.isPresent()) {
            // Update existing entity to retain the primary key ID
            userProfile = existingProfileOpt.get();
            UserProfile updatedData = profileMapper.toEntity(userProfileRequestDto);

            // Map the updated fields over to the existing entity
            userProfile.setGender(updatedData.getGender());
            userProfile.setDateOfBirth(updatedData.getDateOfBirth());
            userProfile.setHeight(updatedData.getHeight());
            userProfile.setWeight(updatedData.getWeight());
            userProfile.setReligion(updatedData.getReligion());
            userProfile.setCommunity(updatedData.getCommunity());
            userProfile.setCaste(updatedData.getCaste());
            userProfile.setGotra(updatedData.getGotra());
            userProfile.setManglikStatus(updatedData.getManglikStatus());
            userProfile.setNakshatra(updatedData.getNakshatra());
            userProfile.setRashi(updatedData.getRashi());
            userProfile.setEducation(updatedData.getEducation());
            userProfile.setOccupation(updatedData.getOccupation());
            userProfile.setEmploymentType(updatedData.getEmploymentType());
            userProfile.setAnnualIncome(updatedData.getAnnualIncome());
            userProfile.setFatherOccupation(updatedData.getFatherOccupation());
            userProfile.setMotherOccupation(updatedData.getMotherOccupation());
            userProfile.setBrothers(updatedData.getBrothers());
            userProfile.setSisters(updatedData.getSisters());
            userProfile.setFamilyType(updatedData.getFamilyType());
            userProfile.setFamilyStatus(updatedData.getFamilyStatus());
            userProfile.setFamilyValues(updatedData.getFamilyValues());
            userProfile.setEatingHabit(updatedData.getEatingHabit());
            userProfile.setDrinkingHabit(updatedData.getDrinkingHabit());
            userProfile.setSmokingHabit(updatedData.getSmokingHabit());
            userProfile.setHealthNote(updatedData.getHealthNote());
            userProfile.setFatherName(updatedData.getFatherName());
            userProfile.setMotherName(updatedData.getMotherName());
            userProfile.setAboutMe(updatedData.getAboutMe());
            userProfile.setProfileCreatedBy(updatedData.getProfileCreatedBy());
            userProfile.setSubCaste(updatedData.getSubCaste());
            userProfile.setDietPreference(updatedData.getDietPreference());
            userProfile.setCity(updatedData.getCity());
        } else {
            // Create a brand new entity
            userProfile = profileMapper.toEntity(userProfileRequestDto);
        }

        UserProfile savedProfile = userProfileRepository.save(userProfile);
        return profileMapper.toResponseDto(savedProfile);
    }

    @Override
    public Optional<UserProfileResponseDto> getProfileByUserId(Long userId) {
        return userProfileRepository.findByUser_UserId(userId)
                .map(profile -> {
                    UserProfileResponseDto dto = profileMapper.toResponseDto(profile);
                    System.out.println("====== PROFILE DIAGNOSTICS FOR USER " + userId + " ======");
                    System.out.println("Main Photo URL: " + dto.getProfilePhotoUrl());
                    System.out.println("Additional Photos Count: " + (dto.getPhotos() != null ? dto.getPhotos().size() : 0));
                    System.out.println("=================================================");
                    return dto;
                });
    }

    @Override
    public void deleteProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository
                .findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        userProfileRepository.delete(profile);
    }

    @Override
    public void updateLocation(Long userId, String city) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUser_UserId(userId);
        if (profileOpt.isPresent()) {
            UserProfile userProfile = profileOpt.get();
            if (city != null && !city.isBlank()) {
                userProfile.setCity(city);
                userProfileRepository.save(userProfile);
            }
        }
    }
}
