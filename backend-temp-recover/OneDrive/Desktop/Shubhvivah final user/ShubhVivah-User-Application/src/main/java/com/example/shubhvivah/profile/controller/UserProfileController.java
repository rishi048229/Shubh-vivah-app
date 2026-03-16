package com.example.shubhvivah.profile.controller;

import java.util.List;
import com.example.shubhvivah.profile.dto.RequestDto.UserProfileRequestDto;
import com.example.shubhvivah.profile.dto.ResponseDto.UserProfileResponseDto;
import com.example.shubhvivah.profile.service.ProfilePhotoService;
import com.example.shubhvivah.profile.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final ProfilePhotoService profilePhotoService;

    // Helper method to get current authenticated user ID
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }

    // ✅ Create or Update Profile (for authenticated user)
    @PostMapping
    public ResponseEntity<UserProfileResponseDto> saveProfile(
            @Valid @RequestBody UserProfileRequestDto userProfileRequestDto) {

        // Force the profile to be created for the authenticated user
        userProfileRequestDto.setUserId(getCurrentUserId());

        return ResponseEntity.ok(
                userProfileService.saveOrUpdateProfile(userProfileRequestDto));
    }

    @GetMapping
    public ResponseEntity<UserProfileResponseDto> getCurrentUserProfile() {
        Long userId = getCurrentUserId();
        return userProfileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get profile by specific user ID (admin functionality)
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfileResponseDto> getProfileByUserId(
            @PathVariable Long userId) {

        // Users can only access their own profile
        Long currentUserId = getCurrentUserId();
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return userProfileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete profile (for authenticated user)
    @DeleteMapping
    public ResponseEntity<Void> deleteCurrentUserProfile() {
        Long userId = getCurrentUserId();
        userProfileService.deleteProfileByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    // ✅ Delete profile by USER ID (admin functionality)
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteProfileByUserId(
            @PathVariable Long userId) {

        // Users can only delete their own profile
        Long currentUserId = getCurrentUserId();
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        userProfileService.deleteProfileByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    // Upload photos
    @PostMapping(value = "/photos", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPhotos(

            @RequestPart(value = "mainPhoto", required = false) MultipartFile mainPhoto,

            @RequestPart(value = "extraPhotos", required = false) List<MultipartFile> extraPhotos) {

        Long userId = getCurrentUserId();

        if ((mainPhoto == null || mainPhoto.isEmpty()) &&
                (extraPhotos == null || extraPhotos.isEmpty())) {
            return ResponseEntity.badRequest().body("No photos provided");
        }

        profilePhotoService.uploadPhotos(userId, mainPhoto, extraPhotos);

        return ResponseEntity.ok("Photos uploaded successfully");
    }

    // ✅ Update main profile photo
    @PutMapping(value = "/photos/main", consumes = "multipart/form-data")
    public ResponseEntity<?> updateMainPhoto(
            @RequestPart("file") MultipartFile file) {

        Long userId = getCurrentUserId();

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }

        profilePhotoService.updateMainPhoto(userId, file);

        return ResponseEntity.ok("Main photo updated successfully");
    }

    // ✅ Delete main profile photo
    @DeleteMapping("/photos/main")
    public ResponseEntity<?> deleteMainPhoto() {

        Long userId = getCurrentUserId();

        profilePhotoService.deleteMainPhoto(userId);

        return ResponseEntity.ok("Main photo deleted successfully");
    }

    // ✅ Update specific extra photo
    @PutMapping(value = "/photos/{photoId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateExtraPhoto(
            @PathVariable Long photoId,
            @RequestPart("file") MultipartFile file) {

        Long userId = getCurrentUserId();

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }

        profilePhotoService.updateExtraPhoto(userId, photoId, file);

        return ResponseEntity.ok("Extra photo updated successfully");
    }

    // ✅ Delete specific extra photo
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<?> deleteExtraPhoto(
            @PathVariable Long photoId) {

        Long userId = getCurrentUserId();

        profilePhotoService.deleteExtraPhoto(userId, photoId);

        return ResponseEntity.ok("Extra photo deleted successfully");
    }
}
