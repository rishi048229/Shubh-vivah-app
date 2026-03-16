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
    
        Object principal = auth.getPrincipal();
    
        if (principal instanceof Long id) {
            return id;
        }
    
        if (principal instanceof String s) {
            return Long.parseLong(s);
        }
    
        throw new IllegalStateException("Invalid authentication principal");
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

            // BLOCK CHECK
            if (isBlocked(currentUserId, candidateUserId)) continue;

            // OPPOSITE GENDER
            if (candidate.getGender() == null || me.getGender() == null) continue;
            if (candidate.getGender().equalsIgnoreCase(me.getGender())) continue;

            if (candidate.getDateOfBirth() == null) continue;
            if (candidate.getProfilePhotoUrl() == null) continue;
            if (viewedIds.contains(candidateUserId)) continue;

            int age = calculateAge(candidate.getDateOfBirth());

            ExploreHistory history = new ExploreHistory();
            history.setUserId(currentUserId);
            history.setViewedUserId(candidateUserId);
            historyRepository.save(history);

            return buildDto(candidate, age);
        }

        // RESET HISTORY
        historyRepository.deleteByUserId(currentUserId);

        return null;
    }

    /* ================= EXPLORE PREVIOUS ================= */

    public MatchmakingDto getPreviousProfile(Long currentUserId) {

        List<ExploreHistory> history =
                historyRepository.findByUserIdOrderByViewedAtDesc(currentUserId);

        if (history.isEmpty()) return null;

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

    /* ================= LIKE (AUTO MATCH) ================= */

    @Transactional
    public String likeUser(Long from, Long to) {

        if (from.equals(to)) return "Cannot like yourself";

        if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.LIKE))
            return "Already liked";

        relationRepository.save(UserRelation.of(from, to, RelationType.LIKE));

        boolean reverseLike =
                relationRepository.existsByFromUserIdAndToUserIdAndType(to, from, RelationType.LIKE);

        if (reverseLike) {
            relationRepository.save(UserRelation.of(from, to, RelationType.MATCH));
            relationRepository.save(UserRelation.of(to, from, RelationType.MATCH));
            return "MATCH!";
        }

        return "Liked";
    }

    /* ================= SHORTLIST ================= */

    public void shortlistUser(Long from, Long to) {
        if (!relationRepository.existsByFromUserIdAndToUserIdAndType(
                from, to, RelationType.SHORTLIST)) {

            relationRepository.save(UserRelation.of(from, to, RelationType.SHORTLIST));
        }
    }

    /* ================= BLOCK ================= */

    @Transactional
    public void blockUser(Long from, Long to) {

        if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.BLOCK))
            return;

        // remove positive relations
        relationRepository.deleteBetweenUsers(from, to, RelationType.LIKE);
        relationRepository.deleteBetweenUsers(from, to, RelationType.MATCH);
        relationRepository.deleteBetweenUsers(from, to, RelationType.SHORTLIST);

        relationRepository.deleteBetweenUsers(to, from, RelationType.LIKE);
        relationRepository.deleteBetweenUsers(to, from, RelationType.MATCH);
        relationRepository.deleteBetweenUsers(to, from, RelationType.SHORTLIST);

        relationRepository.save(UserRelation.of(from, to, RelationType.BLOCK));
    }

    /* ================= UNBLOCK ================= */

    public void unblockUser(Long from, Long to) {
        relationRepository.deleteBetweenUsers(from, to, RelationType.BLOCK);
    }

    /* ================= REPORT ================= */

    @Transactional
    public void reportUser(Long from, Long to, String reason) {

        if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.REPORT))
            return;

        UserRelation r = UserRelation.of(from, to, RelationType.REPORT);
        r.setReportReason(reason);
        relationRepository.save(r);
    }

    /* ================= HELPERS ================= */

    public boolean isBlocked(Long u1, Long u2) {
        return relationRepository.existsByFromUserIdAndToUserIdAndType(u1, u2, RelationType.BLOCK)
                || relationRepository.existsByFromUserIdAndToUserIdAndType(u2, u1, RelationType.BLOCK);
    }
    /* ================= GET LIKED USERS ================= */

public List<UserRelation> getLikedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.LIKE);
}

/* ================= GET SHORTLISTED USERS ================= */

public List<UserRelation> getShortlistedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.SHORTLIST);
}

/* ================= GET BLOCKED USERS ================= */

public List<UserRelation> getBlockedUsers(Long userId) {
    return relationRepository.findByFromUserIdAndType(userId, RelationType.BLOCK);
}
public void sendRequest(Long from, Long to) {

    if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.REQUEST))
        return;

    UserRelation r = new UserRelation();
    r.setFromUserId(from);
    r.setToUserId(to);
    r.setType(RelationType.REQUEST);

    relationRepository.save(r);
}

}
