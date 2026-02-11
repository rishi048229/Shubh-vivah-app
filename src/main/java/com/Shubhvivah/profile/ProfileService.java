package com.Shubhvivah.profile;

import com.Shubhvivah.auth.UserEntity;
import com.Shubhvivah.auth.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


import com.Shubhvivah.matchmaking.RelationType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import com.Shubhvivah.common.ImageUploadService;
import com.Shubhvivah.matchmaking.UserRelationRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {


    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final UserRelationRepository relationRepository;
    private final ProfilePhotoRepository photoRepo;
    private static final int MAX_ADDITIONAL_PHOTOS = 5;
    private final ImageUploadService imageUploadService;

    // =========================
    // PROFILE PHOTO
    // =========================

    private String saveFile(Long userId, MultipartFile file) {
        try {
            String uploadDir = "uploads/profiles/" + userId;
            Files.createDirectories(Paths.get(uploadDir));

            String filename =
                    System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/profiles/" + userId + "/" + filename;

        } catch (Exception e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }

    public void uploadProfilePhoto(Long userId, MultipartFile file) {
        ProfileEntity profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        String url = imageUploadService.uploadImage(file, "profiles/" + userId);

        profile.setProfilePhotoUrl(url);
        profileRepo.save(profile);
    }

    public void uploadAdditionalPhotos(Long userId, List<MultipartFile> files) {

        ProfileEntity profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        int existingCount = profile.getPhotos().size();

        if (existingCount + files.size() > MAX_ADDITIONAL_PHOTOS) {
            throw new IllegalStateException(
                    "You can upload only " + MAX_ADDITIONAL_PHOTOS + " additional photos");
        }

        for (MultipartFile file : files) {

            String cloudUrl =
                    imageUploadService.uploadImage(file, "profiles/" + userId);

            ProfilePhotoEntity photo = new ProfilePhotoEntity();
            photo.setProfile(profile);
            photo.setPhotoUrl(cloudUrl);

            photoRepo.save(photo);
        }
    }

    // =========================
    // DELETE PHOTOS
    // =========================

    public void deleteAdditionalPhoto(Long userId, Long photoId) {

        ProfileEntity profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        ProfilePhotoEntity photo = photoRepo.findById(photoId)
                .orElseThrow(() -> new IllegalStateException("Photo not found"));

        if (!photo.getProfile().getProfileId().equals(profile.getProfileId())) {
            throw new IllegalStateException("Unauthorized delete attempt");
        }

        photoRepo.delete(photo);
    }

    public void deleteProfilePhoto(Long userId) {

        ProfileEntity profile = profileRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        profile.setProfilePhotoUrl(null);
        profileRepo.save(profile);
    }

    /*
     * =========================
     * CREATE / UPDATE PROFILE
     * =========================
     */
    public void saveOrUpdateProfile(Long userId, ProfileDto dto) {

        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }
        if (dto == null) {
            throw new IllegalArgumentException("Profile data is required");
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!user.isVerified()) {
            throw new IllegalStateException("User not verified");
        }

        ProfileEntity profile = profileRepo.findByUser(user)
                .orElseGet(() -> {
                    ProfileEntity p = new ProfileEntity();
                    p.setUser(user);
                    return p;
                });

        mapDtoToEntity(dto, profile);
        profileRepo.save(profile);
    }

    /*
     * =========================
     * GET PROFILE
     * =========================
     */
    public ProfileDto getProfile(Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        ProfileEntity profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Profile not created yet"));

        return mapEntityToDto(profile);
    }

    /*
     * =======================
     * LOCATION UPDATE (NEW)
     * =======================
     */
    public void updateLocation(Long userId, Double lat, Double lng) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        ProfileEntity profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        profile.setLatitude(lat);
        profile.setLongitude(lng);

        profileRepo.save(profile);
    }
    public List<String> getAdditionalPhotos(Long viewer, Long owner) {

        boolean matched =
                relationRepository.existsByFromUserIdAndToUserIdAndType(viewer, owner, RelationType.MATCH)
                &&
                relationRepository.existsByFromUserIdAndToUserIdAndType(owner, viewer, RelationType.MATCH);
    
        if (!matched) {
            throw new RuntimeException("Connection required to view additional photos.");
        }
    
        return photoRepo.findByProfile_User_UserId(owner)
                .stream()
                .map(ProfilePhotoEntity::getPhotoUrl)
                .toList();
    }
    
    
    
    /*
     * =======================
     * MAPPERS
     * =======================
     */

    private void mapDtoToEntity(ProfileDto d, ProfileEntity p) {

        p.setFullName(d.getFullName());
        p.setGender(d.getGender());
        p.setDateOfBirth(d.getDateOfBirth());
        p.setHeight(d.getHeight());
        p.setWeight(d.getWeight());
        p.setCity(d.getCity());

        p.setReligion(d.getReligion());
        p.setCommunity(d.getCommunity());
        p.setCaste(d.getCaste());
        p.setManglikStatus(d.getManglikStatus());
        p.setGothra(d.getGothra());
        p.setNakshatra(d.getNakshatra());
        p.setRashi(d.getRashi());

        p.setHighestEducation(d.getHighestEducation());
        p.setEmploymentType(d.getEmploymentType());
        p.setOccupation(d.getOccupation());
        p.setAnnualIncome(d.getAnnualIncome());

        p.setFatherOccupation(d.getFatherOccupation());
        p.setMotherOccupation(d.getMotherOccupation());
        p.setBrothers(d.getBrothers());
        p.setMarriedBrothers(d.getMarriedBrothers());
        p.setSisters(d.getSisters());
        p.setMarriedSisters(d.getMarriedSisters());
        p.setFamilyType(d.getFamilyType());
        p.setFamilyStatus(d.getFamilyStatus());
        p.setFamilyValues(d.getFamilyValues());

        p.setEatingHabits(d.getEatingHabits());
        p.setDietPreference(d.getDietPreference());
        p.setDrinking(d.getDrinking());
        p.setSmoking(d.getSmoking());
        p.setHealthNotes(d.getHealthNotes());
        p.setAboutMe(d.getAboutMe());
    }

    private ProfileDto mapEntityToDto(ProfileEntity p) {

        ProfileDto d = new ProfileDto();

        d.setFullName(p.getFullName());
        d.setGender(p.getGender());
        d.setDateOfBirth(p.getDateOfBirth());
        d.setHeight(p.getHeight());
        d.setWeight(p.getWeight());
        d.setProfilePhotoUrl(p.getProfilePhotoUrl());

        if (p.getPhotos() != null) {
            d.setAdditionalPhotos(
                    p.getPhotos()
                            .stream()
                            .map(ProfilePhotoEntity::getPhotoUrl)
                            .toList()
            );
        }

        d.setCity(p.getCity());
        d.setReligion(p.getReligion());
        d.setCommunity(p.getCommunity());
        d.setCaste(p.getCaste());
        d.setManglikStatus(p.getManglikStatus());
        d.setGothra(p.getGothra());
        d.setNakshatra(p.getNakshatra());
        d.setRashi(p.getRashi());

        d.setHighestEducation(p.getHighestEducation());
        d.setEmploymentType(p.getEmploymentType());
        d.setOccupation(p.getOccupation());
        d.setAnnualIncome(p.getAnnualIncome());

        d.setFatherOccupation(p.getFatherOccupation());
        d.setMotherOccupation(p.getMotherOccupation());
        d.setBrothers(p.getBrothers());
        d.setMarriedBrothers(p.getMarriedBrothers());
        d.setSisters(p.getSisters());
        d.setMarriedSisters(p.getMarriedSisters());
        d.setFamilyType(p.getFamilyType());
        d.setFamilyStatus(p.getFamilyStatus());
        d.setFamilyValues(p.getFamilyValues());

        d.setEatingHabits(p.getEatingHabits());
        d.setDietPreference(p.getDietPreference());
        d.setDrinking(p.getDrinking());
        d.setSmoking(p.getSmoking());
        d.setHealthNotes(p.getHealthNotes());
        d.setAboutMe(p.getAboutMe());

        return d;
    }
}
