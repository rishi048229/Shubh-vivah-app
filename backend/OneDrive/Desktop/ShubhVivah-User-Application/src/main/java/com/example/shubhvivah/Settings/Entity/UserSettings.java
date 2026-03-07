package com.example.shubhvivah.Settings.Entity;

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

    @Builder.Default
    private boolean showOnlineStatus = true;
    @Builder.Default
    private boolean showLastSeen = true;
    @Builder.Default
    private boolean showDistance = true;
    @Builder.Default
    private boolean profileVisible = true;
    @Builder.Default
    private boolean photosRequireConnection = true;

    /* ================= MATCH PREFERENCES ================= */

    @Builder.Default
    private Integer minAge = 18;
    @Builder.Default
    private Integer maxAge = 40;
    @Builder.Default
    private Integer maxDistanceKm = 50;

    @ElementCollection
    private java.util.List<String> maritalStatus;

    @ElementCollection
    private java.util.List<String> religions;

    @ElementCollection
    private java.util.List<String> communities;

    @ElementCollection
    private java.util.List<String> professions;

    @ElementCollection
    private java.util.List<String> educationLevels;

    @ElementCollection
    private java.util.List<String> lifestylePreferences;

    /* ================= NOTIFICATIONS ================= */

    @Builder.Default
    private boolean notifyNewMessage = true;
    @Builder.Default
    private boolean notifyConnectionRequest = true;
    @Builder.Default
    private boolean notifyConnectionAccepted = true;
}
