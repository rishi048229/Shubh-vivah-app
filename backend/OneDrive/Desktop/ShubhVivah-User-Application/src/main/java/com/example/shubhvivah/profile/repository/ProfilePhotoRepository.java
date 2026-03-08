package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.ProfilePhotoEntity;
import com.example.shubhvivah.profile.enums.PhotoType;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfilePhotoRepository extends JpaRepository<ProfilePhotoEntity, Long> {

    List<ProfilePhotoEntity> findByUserProfileId(Long profileId);

    Optional<ProfilePhotoEntity> findByUserProfileIdAndType(Long profileId, PhotoType type);

    long countByUserProfileIdAndType(Long profileId, PhotoType type);

    long countByUserProfileId(Long profileId);

    void deleteByUserProfileId(Long profileId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ProfilePhotoEntity p WHERE p.userProfile.user.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}