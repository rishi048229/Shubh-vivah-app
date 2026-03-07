package com.example.shubhvivah.Settings.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shubhvivah.Settings.Entity.UserSettings;

@Repository
public interface SettingsRepository extends JpaRepository<UserSettings, Long> {
}
