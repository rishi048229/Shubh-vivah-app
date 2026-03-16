package com.Shubhvivah.Settings;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    private Long userId; // SAME as User ID

    /* ================= PRIVACY ================= */

    private boolean showOnlineStatus = true;
    private boolean showLastSeen = true;
    private boolean showDistance = true;
    private boolean profileVisible = true;
    private boolean photosRequireConnection = true;

    /* ================= MATCH PREFERENCES ================= */

    private Integer minAge = 18;
    private Integer maxAge = 40;
    private Integer maxDistanceKm = 50;

    /* ================= NOTIFICATIONS ================= */

    private boolean notifyNewMessage = true;
    private boolean notifyConnectionRequest = true;
    private boolean notifyConnectionAccepted = true;
}
