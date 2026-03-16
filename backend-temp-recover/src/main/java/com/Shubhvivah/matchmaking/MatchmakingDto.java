package com.Shubhvivah.matchmaking;

import lombok.Data;
import java.util.List;

@Data
public class MatchmakingDto {

    private Long userId;
    private String fullName;

    private int age;
    private String city;
    private String religion;

    private double matchScore;

    private String profilePhotoUrl;
    private List<String> photos;

    // Raw distance in KM (for logic if needed)
    private Double distanceKm;

    // Formatted text for UI -> "5 km away"
    private String distanceText;
}
