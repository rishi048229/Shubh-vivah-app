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
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    public UserProfileResponseDto saveOrUpdateProfile(UserProfileRequestDto userProfileRequestDto) {
        UserProfile userProfile = profileMapper.toEntity(userProfileRequestDto);
        UserProfile savedProfile = userProfileRepository.save(userProfile);
        return profileMapper.toResponseDto(savedProfile);
    }

    @Override
    public Optional<UserProfileResponseDto> getProfileByUserId(Long userId) {
        return userProfileRepository.findByUser_UserId(userId)
                .map(profileMapper::toResponseDto);
    }

    @Override
    public void deleteProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository
                .findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        userProfileRepository.delete(profile);
    }

}
