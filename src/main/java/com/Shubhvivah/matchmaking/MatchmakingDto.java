package com.Shubhvivah.matchmaking;

import lombok.Data;

@Data
public class MatchmakingDto {

    private Long userId;
    private String fullName;

    private int age;
    private String city;
    private String religion;

    private double matchScore;
}
