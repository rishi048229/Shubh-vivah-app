package com.Shubhvivah.profile;

import com.Shubhvivah.auth.UserEntity;
import com.Shubhvivah.auth.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;

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

        // ✅ CORRECT lookup
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
     * MAPPERS
     * =======================
     */

    private void mapDtoToEntity(ProfileDto d, ProfileEntity p) {

        p.setFullName(d.getFullName());
        p.setGender(d.getGender());
        p.setDateOfBirth(d.getDateOfBirth());
        p.setHeight(d.getHeight());
        p.setWeight(d.getWeight());

        // ✅ CITY FIX
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

        // ✅ CITY FIX
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
