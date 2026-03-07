package com.example.shubhvivah.Settings.Dto;

import lombok.Data;

@Data
public class SettingsDto {

    private Long userId;

    /* ================= PRIVACY ================= */

    private boolean showOnlineStatus;
    private boolean showLastSeen;
    private boolean showDistance;
    private boolean profileVisible;
    private boolean photosRequireConnection;

    /* ================= MATCH PREFERENCES ================= */

    private Integer minAge;
    private Integer maxAge;
    private Integer maxDistanceKm;

    private java.util.List<String> maritalStatus;
    private java.util.List<String> religions;
    private java.util.List<String> communities;
    private java.util.List<String> professions;
    private java.util.List<String> educationLevels;
    private java.util.List<String> lifestylePreferences;

    /* ================= NOTIFICATIONS ================= */

    private boolean notifyNewMessage;
    private boolean notifyConnectionRequest;
    private boolean notifyConnectionAccepted;
}
