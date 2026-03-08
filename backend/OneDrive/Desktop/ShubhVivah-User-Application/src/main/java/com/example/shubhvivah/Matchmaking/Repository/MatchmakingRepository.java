package com.example.shubhvivah.Matchmaking.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shubhvivah.profile.entity.UserProfile;

public interface MatchmakingRepository
        extends JpaRepository<UserProfile, Long> {

    List<UserProfile> findByGenderNot(String gender);
}
