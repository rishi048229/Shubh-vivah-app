package com.example.shubhvivah.Settings.Service.Impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shubhvivah.Settings.Repository.SettingsRepository;

import lombok.RequiredArgsConstructor;

import com.example.shubhvivah.Settings.Service.SettingsService;
import com.example.shubhvivah.Settings.Entity.UserSettings;

import com.example.shubhvivah.Settings.Dto.SettingsDto;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository repo;

    @Override
    public UserSettings getSettings(Long userId) {
        return repo.findById(userId)
                .orElseGet(() -> createDefault(userId));
    }

    @Override
    @Transactional
    public void updateSettings(Long userId, SettingsDto dto) {

        UserSettings s = repo.findById(userId)
                .orElseGet(() -> createDefault(userId));

        /* Privacy */
        s.setShowOnlineStatus(dto.isShowOnlineStatus());
        s.setShowLastSeen(dto.isShowLastSeen());
        s.setShowDistance(dto.isShowDistance());
        s.setProfileVisible(dto.isProfileVisible());
        s.setPhotosRequireConnection(dto.isPhotosRequireConnection());

        /* Preferences */
        s.setMinAge(dto.getMinAge());
        s.setMaxAge(dto.getMaxAge());
        s.setMaxDistanceKm(dto.getMaxDistanceKm());

        /* Notifications */
        s.setNotifyNewMessage(dto.isNotifyNewMessage());
        s.setNotifyConnectionRequest(dto.isNotifyConnectionRequest());
        s.setNotifyConnectionAccepted(dto.isNotifyConnectionAccepted());

        repo.save(s);
    }

    private UserSettings createDefault(Long userId) {
        UserSettings s = UserSettings.builder()
                .userId(userId)
                .build();

        return repo.save(s);
    }
}