package com.Shubhvivah.matchmaking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Shubhvivah.profile.ProfileEntity;

public interface MatchmakingRepository
        extends JpaRepository<ProfileEntity, Long> {

    List<ProfileEntity> findByGenderNot(String gender);
}
