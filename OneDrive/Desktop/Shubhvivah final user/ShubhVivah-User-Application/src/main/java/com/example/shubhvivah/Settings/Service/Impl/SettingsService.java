package com.example.shubhvivah.Settings.Service.Impl;


import com.example.shubhvivah.Settings.Dto.SettingsDto;
import com.example.shubhvivah.Settings.Entity.UserSettings;

public interface SettingsService {

    UserSettings getSettings(Long userId);

    void updateSettings(Long userId, SettingsDto dto);
}