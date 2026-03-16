package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.Authentication.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    @Query("SELECT p FROM UserProfile p WHERE LOWER(p.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.aboutMe) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<UserProfile> searchGlobal(@Param("query") String query);

    // Safe search that only uses UserProfile fields (no JOIN to users table)
    @Query("SELECT p FROM UserProfile p WHERE LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.aboutMe) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<UserProfile> searchByProfileFields(@Param("query") String query);

    // Find all with user eagerly loaded
    @Query("SELECT p FROM UserProfile p JOIN FETCH p.user")
    List<UserProfile> findAllWithUser();

    // Search with user eagerly loaded
    @Query("SELECT p FROM UserProfile p JOIN FETCH p.user WHERE LOWER(p.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.aboutMe) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<UserProfile> searchGlobalWithUser(@Param("query") String query);
}
