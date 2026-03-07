package com.example.shubhvivah.Matchmaking.Dto;

import lombok.Data;

@Data
public class ExploreProfileDto {
    Long userId;
    String name;
    int age;
    String city;
    String profilePhoto;
    int matchScore;
}
