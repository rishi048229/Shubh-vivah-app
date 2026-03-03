package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.Authentication.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser_UserId(Long userId);

    Optional<UserProfile> findByUser(UserEntity user);

    boolean existsByUser_UserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserProfile p WHERE p.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
