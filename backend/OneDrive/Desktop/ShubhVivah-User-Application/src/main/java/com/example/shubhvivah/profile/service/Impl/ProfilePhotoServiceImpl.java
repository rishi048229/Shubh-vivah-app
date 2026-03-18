package com.example.shubhvivah.profile.service.Impl;

import com.example.shubhvivah.profile.entity.ProfilePhotoEntity;
import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.profile.enums.PhotoType;
import com.example.shubhvivah.profile.repository.ProfilePhotoRepository;
import com.example.shubhvivah.profile.repository.UserProfileRepository;
import com.example.shubhvivah.profile.service.CloudinaryService;
import com.example.shubhvivah.profile.service.ProfilePhotoService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfilePhotoServiceImpl implements ProfilePhotoService {

    private final ProfilePhotoRepository photoRepo;
    private final UserProfileRepository profileRepo;
    private final CloudinaryService cloudinaryService;

    private static final int MAX_EXTRA_PHOTOS = 10;

    // =====================================================
    // UPLOAD PHOTOS
    // =====================================================

    @Override
    public void uploadPhotos(Long userId,
            MultipartFile mainPhoto,
            List<MultipartFile> extraPhotos) {

        UserProfile profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Long profileId = profile.getId();

        /* ---------------- MAIN PHOTO ---------------- */

        if (mainPhoto != null && !mainPhoto.isEmpty()) {

            photoRepo.findByUserProfileIdAndType(profileId, PhotoType.MAIN)
                    .ifPresent(photo -> {
                        cloudinaryService.deleteFile(photo.getPhotoUrl());
                        photoRepo.delete(photo);
                    });

            String url = cloudinaryService.uploadFile(mainPhoto);

            ProfilePhotoEntity main = ProfilePhotoEntity.builder()
                    .photoUrl(url)
                    .type(PhotoType.MAIN)
                    .userProfile(profile)
                    .build();

            photoRepo.save(main);
            
            // Duplicate main photo link to UserProfile container for direct lookups
            profile.setProfilePhotoUrl(url);
            profileRepo.save(profile);
        }

        /* ---------------- EXTRA PHOTOS ---------------- */

        if (extraPhotos != null && !extraPhotos.isEmpty()) {

            long existingCount = photoRepo.countByUserProfileIdAndType(profileId, PhotoType.EXTRA);

            if (existingCount + extraPhotos.size() > MAX_EXTRA_PHOTOS) {
                throw new RuntimeException(
                        "Maximum " + MAX_EXTRA_PHOTOS + " additional photos allowed");
            }

            for (MultipartFile file : extraPhotos) {

                if (!file.isEmpty()) {

                    String url = cloudinaryService.uploadFile(file);

                    ProfilePhotoEntity photo = ProfilePhotoEntity.builder()
                            .photoUrl(url)
                            .type(PhotoType.EXTRA)
                            .userProfile(profile)
                            .build();

                    photoRepo.save(photo);
                }
            }
        }
    }

    // =====================================================
    // UPDATE MAIN PHOTO
    // =====================================================

    @Override
    public void updateMainPhoto(Long userId, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        UserProfile profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfilePhotoEntity existing = photoRepo.findByUserProfileIdAndType(profile.getId(), PhotoType.MAIN)
                .orElseThrow(() -> new RuntimeException("Main photo not found"));

        cloudinaryService.deleteFile(existing.getPhotoUrl());

        String newUrl = cloudinaryService.uploadFile(file);

        existing.setPhotoUrl(newUrl);

        photoRepo.save(existing);
        
        // Duplicate main photo link to UserProfile container for direct lookups
        profile.setProfilePhotoUrl(newUrl);
        profileRepo.save(profile);
    }

    // =====================================================
    // DELETE MAIN PHOTO
    // =====================================================

    @Override
    public void deleteMainPhoto(Long userId) {
        UserProfile profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfilePhotoEntity photo = photoRepo.findByUserProfileIdAndType(profile.getId(), PhotoType.MAIN)
                .orElseThrow(() -> new RuntimeException("Main photo not found"));

        cloudinaryService.deleteFile(photo.getPhotoUrl());

        photoRepo.delete(photo);
        
        profile.setProfilePhotoUrl(null);
        profileRepo.save(profile);
    }

    // =====================================================
    // DELETE EXTRA PHOTO
    // =====================================================

    @Override
    public void deleteExtraPhoto(Long userId, Long photoId) {
        UserProfile profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfilePhotoEntity photo = photoRepo.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (!photo.getUserProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        if (photo.getType() != PhotoType.EXTRA) {
            throw new RuntimeException("Not an extra photo");
        }

        cloudinaryService.deleteFile(photo.getPhotoUrl());

        photoRepo.delete(photo);
    }

    // =====================================================
    // UPDATE EXTRA PHOTO
    // =====================================================

    @Override
    public void updateExtraPhoto(Long userId,
            Long photoId,
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        UserProfile profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfilePhotoEntity photo = photoRepo.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (!photo.getUserProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        if (photo.getType() != PhotoType.EXTRA) {
            throw new RuntimeException("Not an extra photo");
        }

        cloudinaryService.deleteFile(photo.getPhotoUrl());

        String newUrl = cloudinaryService.uploadFile(file);

        photo.setPhotoUrl(newUrl);

        photoRepo.save(photo);
    }
}