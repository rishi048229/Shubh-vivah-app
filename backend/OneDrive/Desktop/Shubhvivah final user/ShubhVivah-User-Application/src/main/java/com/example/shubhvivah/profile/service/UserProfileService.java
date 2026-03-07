package com.example.shubhvivah.profile.service;

import com.example.shubhvivah.profile.dto.RequestDto.UserProfileRequestDto;
import com.example.shubhvivah.profile.dto.ResponseDto.UserProfileResponseDto;
import java.util.Optional;

public interface UserProfileService {

    UserProfileResponseDto saveOrUpdateProfile(UserProfileRequestDto userProfileRequestDto);

    Optional<UserProfileResponseDto> getProfileByUserId(Long userId);

    void deleteProfileByUserId(Long userId);

    void updateLocation(Long userId, String city);
}
