package com.Shubhvivah.matchmaking;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import com.Shubhvivah.auth.*;
import com.Shubhvivah.profile.*;




import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.Shubhvivah.profile.ProfileEntity;




@Service
@RequiredArgsConstructor

public class MatchmakingService {

    private final MatchmakingRepository matchmakingRepo;
    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;

    public List<MatchmakingDto> getMatches(
            Integer minAge,
            Integer maxAge,
            String religion,
            String city) {

        Long userId = getCurrentUserId();

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        ProfileEntity me = profileRepo.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        int myAge = calculateAge(me.getDateOfBirth());

        List<ProfileEntity> candidates =
                matchmakingRepo.findByGenderNot(me.getGender());

        List<MatchmakingDto> results = new ArrayList<>();

        for (ProfileEntity candidate : candidates) {

            if (candidate.getUser().getUserId().equals(userId)) continue;

            int candidateAge = calculateAge(candidate.getDateOfBirth());

            if (minAge != null && candidateAge < minAge) continue;
            if (maxAge != null && candidateAge > maxAge) continue;
            if (city != null && !city.equalsIgnoreCase(candidate.getCity())) continue;
            if (religion != null && !religion.equalsIgnoreCase(candidate.getReligion())) continue;

            double score = calculateMatchScore(me, candidate, myAge, candidateAge);

            if (score >= 40) {
                MatchmakingDto dto = new MatchmakingDto();
                dto.setUserId(candidate.getUser().getUserId());
                dto.setFullName(candidate.getFullName());
                dto.setAge(candidateAge);
                dto.setCity(candidate.getCity());
                dto.setReligion(candidate.getReligion());
                dto.setMatchScore(score);
                results.add(dto);
            }
        }

        results.sort(
            Comparator.comparingDouble(MatchmakingDto::getMatchScore).reversed()
        );

        return results;
    }



    // ---------------- HELPERS ----------------

    private double calculateMatchScore(
            ProfileEntity me,
            ProfileEntity other,
            int myAge,
            int otherAge) {

        double score = 0;

        int ageDiff = Math.abs(myAge - otherAge);
        if (ageDiff <= 1) score += 40;
        else if (ageDiff <= 3) score += 30;
        else if (ageDiff <= 5) score += 20;

        if (me.getCity() != null &&
                me.getCity().equalsIgnoreCase(other.getCity())) {
            score += 30;
        }

        if (me.getReligion() != null &&
                me.getReligion().equalsIgnoreCase(other.getReligion())) {
            score += 20;
        }

        return score;
    }

    private int calculateAge(LocalDate dob) {
        return Period.between(dob, LocalDate.now()).getYears();
    }

    private Long getCurrentUserId() {

        var authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof Long)) {
            throw new IllegalStateException("Invalid authentication principal");
        }

        return (Long) principal;
    }
    // 🔍 MANUAL SEARCH (USER CONTROLLED)
public List<MatchmakingDto> searchMatches(
    Integer minAge,
    Integer maxAge,
    String religion,
    String city,
    String maritalStatus
) {

Long userId = getCurrentUserId();

UserEntity user = userRepo.findById(userId)
        .orElseThrow(() -> new IllegalStateException("User not found"));

ProfileEntity me = profileRepo.findByUser(user)
        .orElseThrow(() -> new IllegalStateException("Profile not found"));

List<ProfileEntity> candidates =
        matchmakingRepo.findByGenderNot(me.getGender());

List<MatchmakingDto> results = new ArrayList<>();

for (ProfileEntity candidate : candidates) {

    if (candidate.getUser().getUserId().equals(userId)) continue;

    int candidateAge = calculateAge(candidate.getDateOfBirth());

    // 🔎 USER FILTERS ONLY
    if (minAge != null && candidateAge < minAge) continue;
    if (maxAge != null && candidateAge > maxAge) continue;
    if (city != null && !city.equalsIgnoreCase(candidate.getCity())) continue;
    if (religion != null && !religion.equalsIgnoreCase(candidate.getReligion())) continue;

    // maritalStatus ready for future
    if (maritalStatus != null &&
        candidate.getManglikStatus() != null &&
        !maritalStatus.equalsIgnoreCase(candidate.getManglikStatus())) {
        continue;
    }

    double score = calculateMatchScore(
            me,
            candidate,
            calculateAge(me.getDateOfBirth()),
            candidateAge
    );

    MatchmakingDto dto = new MatchmakingDto();
    dto.setUserId(candidate.getUser().getUserId());
    dto.setFullName(candidate.getFullName());
    dto.setAge(candidateAge);
    dto.setCity(candidate.getCity());
    dto.setReligion(candidate.getReligion());
    dto.setMatchScore(score);

    results.add(dto);
}

return results;
}

}