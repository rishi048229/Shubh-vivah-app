package com.Shubhvivah.profile;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /*
     * CREATE / UPDATE PROFILE
     */
    @PostMapping
    public ResponseEntity<String> saveOrUpdateProfile(
            @Valid @RequestBody ProfileDto profileDto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        profileService.saveOrUpdateProfile(userId, profileDto);

        return ResponseEntity.ok("Profile saved or updated successfully");
    }

    /*
     * GET PROFILE
     */
    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    // =========================
    // PROFILE PHOTO
    // =========================

    @PostMapping("/photo")
    public ResponseEntity<String> uploadProfilePhoto(
            @RequestParam MultipartFile file) {

        Long userId = getCurrentUserId();
        profileService.uploadProfilePhoto(userId, file);
        return ResponseEntity.ok("Profile photo uploaded");
    }

    @PostMapping("/photos")
    public ResponseEntity<String> uploadPhotos(
            @RequestParam List<MultipartFile> files) {

        Long userId = getCurrentUserId();
        profileService.uploadAdditionalPhotos(userId, files);
        return ResponseEntity.ok("Photos uploaded");
    }

    @DeleteMapping("/photo")
    public ResponseEntity<String> deleteProfilePhoto() {
        profileService.deleteProfilePhoto(getCurrentUserId());
        return ResponseEntity.ok("Profile photo deleted");
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<String> deleteAdditionalPhoto(@PathVariable Long photoId) {
        profileService.deleteAdditionalPhoto(getCurrentUserId(), photoId);
        return ResponseEntity.ok("Photo deleted");
    }

    // =========================
    // LOCATION UPDATE (NEW)
    // =========================
    // Frontend will call this after user allows GPS
    // Example: PUT /profile/location?lat=19.0760&lng=72.8777

    @PutMapping("/location")
    public ResponseEntity<String> updateLocation(
            @RequestParam Double lat,
            @RequestParam Double lng) {

        Long userId = getCurrentUserId();
        profileService.updateLocation(userId, lat, lng);

        return ResponseEntity.ok("Location updated");
    }

    // =========================
    // AUTH HELPER
    // =========================

    public Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
    
        if (auth == null || !auth.isAuthenticated())
            throw new IllegalStateException("User not authenticated");
    
        Object principal = auth.getPrincipal();
    
        if (principal instanceof Long id) {
            return id;
        }
    
        if (principal instanceof String s) {
            return Long.parseLong(s);
        }
    
        throw new IllegalStateException("Invalid authentication principal");
    }
    // =========================
// VIEW ADDITIONAL PHOTOS (MATCH REQUIRED)
// =========================

@GetMapping("/photos/{ownerId}")
public ResponseEntity<List<String>> viewAdditionalPhotos(@PathVariable Long ownerId) {

    Long viewerId = getCurrentUserId();

    List<String> photos = profileService.getAdditionalPhotos(viewerId, ownerId);

    return ResponseEntity.ok(photos);
}

}
