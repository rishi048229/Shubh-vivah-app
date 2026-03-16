package com.Shubhvivah.profile;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

import com.Shubhvivah.auth.UserEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {

    Optional<ProfileEntity> findByUser(UserEntity user);

    Optional<ProfileEntity> findByUser_UserId(Long userId);

    @Modifying
    @Transactional
    @Query("""
                DELETE FROM ProfileEntity p
                WHERE p.user.userId = :userId
            """)
    void deleteByUserId(@Param("userId") Long userId);

}
