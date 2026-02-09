package com.Shubhvivah.profile;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePhotoRepository
        extends JpaRepository<ProfilePhotoEntity, Long> {
}
