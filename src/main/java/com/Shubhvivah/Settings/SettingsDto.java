package com.Shubhvivah.Settings;

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

    /* ================= NOTIFICATIONS ================= */

    private boolean notifyNewMessage;
    private boolean notifyConnectionRequest;
    private boolean notifyConnectionAccepted;
}
