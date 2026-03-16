package com.Shubhvivah.Settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository repo;

    /* ================= GET ================= */

    public UserSettings getSettings(Long userId) {
        return repo.findById(userId)
                .orElseGet(() -> createDefault(userId));
    }

    /* ================= UPDATE ================= */
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

    /* ================= DEFAULT ================= */

    private UserSettings createDefault(Long userId) {
        UserSettings s = UserSettings.builder()
                .userId(userId)
                .build();

        return repo.save(s);
    }
}
