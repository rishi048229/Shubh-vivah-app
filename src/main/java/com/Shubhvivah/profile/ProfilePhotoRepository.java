package com.Shubhvivah.profile;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePhotoRepository
        extends JpaRepository<ProfilePhotoEntity, Long> {
                List<ProfilePhotoEntity> findByProfile_User_UserId(Long userId);

}
