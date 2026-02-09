package com.Shubhvivah.matchmaking;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import com.Shubhvivah.auth.UserEntity;
import com.Shubhvivah.auth.UserRepository;
import com.Shubhvivah.profile.ProfileEntity;
import com.Shubhvivah.profile.ProfilePhotoEntity;
import com.Shubhvivah.profile.ProfileRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {

    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final UserRelationRepository relationRepository;
    private final ExploreHistoryRepository historyRepository;

    /* ================= DISTANCE ================= */

    private double calculateDistanceKm(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;

        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    /* ================= AUTH ================= */

    public Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            throw new IllegalStateException("User not authenticated");

        return (Long) auth.getPrincipal();
    }

    private int calculateAge(LocalDate dob) {
        return Period.between(dob, LocalDate.now()).getYears();
    }

    /* ================= FULL PROFILE ================= */

    public ProfileEntity getFullProfile(Long userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    /* ================= DTO BUILDER ================= */

    private MatchmakingDto buildDto(ProfileEntity candidate, int age) {

        MatchmakingDto dto = new MatchmakingDto();
        dto.setUserId(candidate.getUser().getUserId());
        dto.setFullName(candidate.getFullName());
        dto.setAge(age);
        dto.setCity(candidate.getCity());
        dto.setProfilePhotoUrl(candidate.getProfilePhotoUrl());

        dto.setPhotos(
                candidate.getPhotos()
                        .stream()
                        .map(ProfilePhotoEntity::getPhotoUrl)
                        .toList()
        );

        ProfileEntity me = profileRepo.findByUser_UserId(getCurrentUserId()).orElse(null);

        if (me != null &&
                me.getLatitude() != null && me.getLongitude() != null &&
                candidate.getLatitude() != null && candidate.getLongitude() != null) {

            double distance = calculateDistanceKm(
                    me.getLatitude(), me.getLongitude(),
                    candidate.getLatitude(), candidate.getLongitude());

            dto.setDistanceKm(distance);
            dto.setDistanceText(((int) distance) + " km away");
        }

        return dto;
    }

    /* ================= EXPLORE NEXT ================= */
   /* ================= EXPLORE NEXT ================= */


@Transactional
public MatchmakingDto getNextProfile(Long currentUserId) {

    List<Long> viewedIds = historyRepository
            .findByUserIdOrderByViewedAtDesc(currentUserId)
            .stream()
            .map(ExploreHistory::getViewedUserId)
            .toList();

    ProfileEntity me = profileRepo.findByUser_UserId(currentUserId).orElse(null);
    if (me == null) return null;

    for (UserEntity user : userRepo.findAll()) {

        Long candidateUserId = user.getUserId();

        if (candidateUserId.equals(currentUserId)) continue;

        ProfileEntity candidate = profileRepo.findByUser(user).orElse(null);
        if (candidate == null) continue;

        /* ===== SKIP BLOCKED USERS ===== */

        boolean iBlocked = relationRepository.existsByFromUserIdAndToUserIdAndType(
                currentUserId, candidateUserId, RelationType.BLOCK);

        boolean blockedMe = relationRepository.existsByFromUserIdAndToUserIdAndType(
                candidateUserId, currentUserId, RelationType.BLOCK);

        if (iBlocked || blockedMe) continue;

        /* ===== OPPOSITE GENDER ONLY ===== */

        if (candidate.getGender() == null || me.getGender() == null) continue;
        if (candidate.getGender().equalsIgnoreCase(me.getGender())) continue;

        /* ===== SKIP INCOMPLETE PROFILE ===== */

        if (candidate.getDateOfBirth() == null) continue;
        if (candidate.getProfilePhotoUrl() == null) continue;

        /* ===== SKIP ALREADY VIEWED ===== */

        if (viewedIds.contains(candidateUserId)) continue;

        int age = calculateAge(candidate.getDateOfBirth());

        /* ===== SAVE HISTORY ===== */

        ExploreHistory history = new ExploreHistory();
        history.setUserId(currentUserId);
        history.setViewedUserId(candidateUserId);
        historyRepository.save(history);

        return buildDto(candidate, age);
    }

    /* ===== IF ALL USERS SEEN → RESET & RESTART ===== */

    historyRepository.deleteByUserId(currentUserId);

    // Try once more after reset (prevents infinite loop)
    for (UserEntity user : userRepo.findAll()) {

        Long candidateUserId = user.getUserId();

        if (candidateUserId.equals(currentUserId)) continue;

        ProfileEntity candidate = profileRepo.findByUser(user).orElse(null);
        if (candidate == null) continue;

        if (candidate.getGender() == null || me.getGender() == null) continue;
        if (candidate.getGender().equalsIgnoreCase(me.getGender())) continue;

        if (candidate.getDateOfBirth() == null) continue;
        if (candidate.getProfilePhotoUrl() == null) continue;

        int age = calculateAge(candidate.getDateOfBirth());

        ExploreHistory history = new ExploreHistory();
        history.setUserId(currentUserId);
        history.setViewedUserId(candidateUserId);
        historyRepository.save(history);

        return buildDto(candidate, age);
    }

    return null; // No valid users exist
}


    
    
    
  /* ================= EXPLORE PREVIOUS ================= */
  public MatchmakingDto getPreviousProfile(Long currentUserId) {

    List<ExploreHistory> history =
            historyRepository.findByUserIdOrderByViewedAtDesc(currentUserId);

    if (history.isEmpty()) return null;

    // If only one profile viewed → return same profile (not null)
    Long targetUserId = (history.size() == 1)
            ? history.get(0).getViewedUserId()
            : history.get(1).getViewedUserId();

    UserEntity user = userRepo.findById(targetUserId).orElse(null);
    if (user == null) return null;

    ProfileEntity candidate = profileRepo.findByUser(user).orElse(null);
    if (candidate == null) return null;

    int age = calculateAge(candidate.getDateOfBirth());
    return buildDto(candidate, age);
}


    
    

    /* ================= LIKE ================= */

    public void likeUser(Long fromUserId, Long toUserId) {
        if (!relationRepository.existsByFromUserIdAndToUserIdAndType(
                fromUserId, toUserId, RelationType.LIKE)) {

            UserRelation r = new UserRelation();
            r.setFromUserId(fromUserId);
            r.setToUserId(toUserId);
            r.setType(RelationType.LIKE);
            relationRepository.save(r);
        }
    }

    /* ================= SHORTLIST ================= */

    public void shortlistUser(Long fromUserId, Long toUserId) {
        if (!relationRepository.existsByFromUserIdAndToUserIdAndType(
                fromUserId, toUserId, RelationType.SHORTLIST)) {

            UserRelation r = new UserRelation();
            r.setFromUserId(fromUserId);
            r.setToUserId(toUserId);
            r.setType(RelationType.SHORTLIST);
            relationRepository.save(r);
        }
    }
    /* ================= BLOCK ================= */

public void blockUser(Long fromUserId, Long toUserId) {

    if (!relationRepository.existsByFromUserIdAndToUserIdAndType(
            fromUserId, toUserId, RelationType.BLOCK)) {

        UserRelation r = new UserRelation();
        r.setFromUserId(fromUserId);
        r.setToUserId(toUserId);
        r.setType(RelationType.BLOCK);

        relationRepository.save(r);
    }
}

/* ================= UNBLOCK ================= */

public void unblockUser(Long fromUserId, Long toUserId) {
    relationRepository.deleteByFromUserIdAndToUserIdAndType(
            fromUserId, toUserId, RelationType.BLOCK);
}

/* ================= GET LIKED ================= */

public List<UserRelation> getLikedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.LIKE);
}

/* ================= GET SHORTLISTED ================= */

public List<UserRelation> getShortlistedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.SHORTLIST);
}

/* ================= GET BLOCKED ================= */

public List<UserRelation> getBlockedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.BLOCK);
}
@Transactional
public void reportUser(Long fromUserId, Long toUserId, String reason) {

    // Prevent duplicate reports
    if (relationRepository.existsByFromUserIdAndToUserIdAndType(
            fromUserId, toUserId, RelationType.REPORT)) {
        return;
    }

    UserRelation r = new UserRelation();
    r.setFromUserId(fromUserId);
    r.setToUserId(toUserId);
    r.setType(RelationType.REPORT);
    r.setReportReason(reason);

    relationRepository.save(r);
}

}
