package com.Shubhvivah.profile;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Shubhvivah.auth.UserEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {

    Optional<ProfileEntity> findByUser(UserEntity user);
}
