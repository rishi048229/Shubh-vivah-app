package com.Shubhvivah.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

public interface ProfilePhotoRepository
                extends JpaRepository<ProfilePhotoEntity, Long> {
        List<ProfilePhotoEntity> findByProfile_User_UserId(Long userId);

        @Modifying
        @Transactional
        @Query("""
                            DELETE FROM ProfilePhotoEntity p
                            WHERE p.profile.user.userId = :userId
                        """)
        void deleteAllByUserId(@Param("userId") Long userId);

}
