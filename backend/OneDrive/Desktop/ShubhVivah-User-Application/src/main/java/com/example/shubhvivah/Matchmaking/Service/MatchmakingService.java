package com.example.shubhvivah.Matchmaking.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import com.example.shubhvivah.Authentication.Entity.UserEntity;
import com.example.shubhvivah.Authentication.Repository.UserRepository;
import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.profile.entity.ProfilePhotoEntity;
import com.example.shubhvivah.profile.repository.UserProfileRepository;
import com.example.shubhvivah.Matchmaking.Entity.ExploreHistory;
import com.example.shubhvivah.Matchmaking.Entity.UserRelation;
import com.example.shubhvivah.Matchmaking.Repository.ExploreHistoryRepository;
import com.example.shubhvivah.Matchmaking.Repository.UserRelationRepository;
import com.example.shubhvivah.Matchmaking.Dto.MatchmakingDto;
import com.example.shubhvivah.Matchmaking.enums.RelationType;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchmakingService {

    private final UserProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final UserRelationRepository relationRepository;
    private final ExploreHistoryRepository historyRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /* ================= DISTANCE ================= */

    private double calculateDistanceKm(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
            return 0;

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
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated())
            throw new IllegalStateException("User not authenticated");

        Object principal = auth.getPrincipal();

        if (principal instanceof Long) {
            Long id = (Long) principal;
            return id;
        }

        if (principal instanceof String) {
            String s = (String) principal;
            return Long.parseLong(s);
        }

        throw new IllegalStateException("Invalid authentication principal");
    }

    private int calculateAge(LocalDate dob) {
        return Period.between(dob, LocalDate.now()).getYears();
    }

    /* ================= FULL PROFILE ================= */

    public UserProfile getFullProfile(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    /* ================= DTO BUILDER ================= */

    private MatchmakingDto buildDto(UserProfile candidate, int age) {

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
                        .toList());

        UserProfile me = profileRepo.findByUser_UserId(getCurrentUserId()).orElse(null);

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

    /* ================= SEARCH ================= */

    public List<MatchmakingDto> searchUsers(String query, Integer minAge, Integer maxAge, String religion,
            String city) {
        Long currentUserId = getCurrentUserId();
        List<UserProfile> matches = (query == null || query.trim().isEmpty())
                ? profileRepo.findAll()
                : profileRepo.searchGlobal(query);

        return matches.stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> !p.getUser().getUserId().equals(currentUserId))
                .filter(p -> !isBlocked(currentUserId, p.getUser().getUserId()))
                .filter(p -> {
                    if (city != null && !city.isEmpty()) {
                        return p.getCity() != null && p.getCity().equalsIgnoreCase(city);
                    }
                    return true;
                })
                .filter(p -> {
                    if (religion != null && !religion.isEmpty()) {
                        return p.getReligion() != null && p.getReligion().toString().equalsIgnoreCase(religion);
                    }
                    return true;
                })
                .map(p -> {
                    int age = p.getDateOfBirth() != null ? calculateAge(p.getDateOfBirth()) : 0;
                    return new Object[] { p, age };
                })
                .filter(arr -> {
                    int age = (int) arr[1];
                    if (minAge != null && age < minAge)
                        return false;
                    if (maxAge != null && age > maxAge)
                        return false;
                    return true;
                })
                .map(arr -> buildDto((UserProfile) arr[0], (int) arr[1]))
                .toList();
    }

    public List<String> getSearchSuggestions(String query) {
        if (query == null || query.trim().isEmpty())
            return java.util.List.of();
        Long currentUserId = getCurrentUserId();

        List<UserProfile> profiles = profileRepo.searchGlobal(query).stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> !p.getUser().getUserId().equals(currentUserId))
                .filter(p -> !isBlocked(currentUserId, p.getUser().getUserId()))
                .toList();

        List<String> suggestions = new java.util.ArrayList<>();
        String lowerQuery = query.toLowerCase();

        for (UserProfile p : profiles) {
            if (p.getUser().getFullName() != null && p.getUser().getFullName().toLowerCase().contains(lowerQuery)) {
                suggestions.add(p.getUser().getFullName());
            }
            if (p.getCity() != null && p.getCity().toLowerCase().contains(lowerQuery)) {
                suggestions.add(p.getCity());
            }
        }

        return suggestions.stream()
                .distinct()
                .limit(10)
                .toList();
    }

    /* ================= HOME SCREEN WIDGETS ================= */

    public List<MatchmakingDto> getNearbyMatches(Long currentUserId) {
        UserProfile me = profileRepo.findByUser_UserId(currentUserId).orElse(null);
        if (me == null || me.getCity() == null)
            return List.of();

        return profileRepo.findAll().stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> !p.getUser().getUserId().equals(currentUserId))
                .filter(p -> !isBlocked(currentUserId, p.getUser().getUserId()))
                .filter(p -> {
                    if (me.getGender() == null || p.getGender() == null)
                        return true;
                    return p.getGender() != me.getGender();
                })
                .filter(p -> me.getCity().equalsIgnoreCase(p.getCity()))
                .limit(10)
                .map(p -> buildDto(p, p.getDateOfBirth() != null ? calculateAge(p.getDateOfBirth()) : 0))
                .toList();
    }

    public List<MatchmakingDto> getBestMatches(Long currentUserId) {
        UserProfile me = profileRepo.findByUser_UserId(currentUserId).orElse(null);

        return profileRepo.findAll().stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> !p.getUser().getUserId().equals(currentUserId))
                .filter(p -> !isBlocked(currentUserId, p.getUser().getUserId()))
                .filter(p -> {
                    if (me == null || me.getGender() == null || p.getGender() == null)
                        return true;
                    return p.getGender() != me.getGender();
                })
                .limit(10)
                .map(p -> buildDto(p, p.getDateOfBirth() != null ? calculateAge(p.getDateOfBirth()) : 0))
                .toList();
    }

    public List<MatchmakingDto> getNewMatches(Long currentUserId) {
        UserProfile me = profileRepo.findByUser_UserId(currentUserId).orElse(null);

        return profileRepo.findAll().stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> !p.getUser().getUserId().equals(currentUserId))
                .filter(p -> !isBlocked(currentUserId, p.getUser().getUserId()))
                .filter(p -> {
                    if (me == null || me.getGender() == null || p.getGender() == null)
                        return true;
                    return p.getGender() != me.getGender();
                })
                .sorted((p1, p2) -> p2.getUser().getUserId().compareTo(p1.getUser().getUserId()))
                .limit(10)
                .map(p -> buildDto(p, p.getDateOfBirth() != null ? calculateAge(p.getDateOfBirth()) : 0))
                .toList();
    }

    /* ================= EXPLORE NEXT ================= */

    @Transactional
    public MatchmakingDto getNextProfile(Long currentUserId) {

        List<Long> viewedIds = historyRepository
                .findByUserIdOrderByViewedAtDesc(currentUserId)
                .stream()
                .map(ExploreHistory::getViewedUserId)
                .toList();

        UserProfile me = profileRepo.findByUser_UserId(currentUserId).orElse(null);
        if (me == null)
            return null;

        for (UserEntity user : userRepo.findAll()) {

            Long candidateUserId = user.getUserId();
            if (candidateUserId.equals(currentUserId))
                continue;

            UserProfile candidate = profileRepo.findByUser(user).orElse(null);
            if (candidate == null)
                continue;

            // BLOCK CHECK
            if (isBlocked(currentUserId, candidateUserId))
                continue;

            // OPPOSITE GENDER
            if (candidate.getGender() == null || me.getGender() == null)
                continue;
            if (candidate.getGender() == me.getGender())
                continue;

            if (candidate.getDateOfBirth() == null)
                continue;
            if (candidate.getProfilePhotoUrl() == null)
                continue;
            if (viewedIds.contains(candidateUserId))
                continue;

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

        List<ExploreHistory> history = historyRepository.findByUserIdOrderByViewedAtDesc(currentUserId);

        if (history.isEmpty())
            return null;

        Long targetUserId = (history.size() == 1)
                ? history.get(0).getViewedUserId()
                : history.get(1).getViewedUserId();

        UserEntity user = userRepo.findById(targetUserId).orElse(null);
        if (user == null)
            return null;

        UserProfile candidate = profileRepo.findByUser(user).orElse(null);
        if (candidate == null)
            return null;

        int age = calculateAge(candidate.getDateOfBirth());
        return buildDto(candidate, age);
    }

    /* ================= LIKE (AUTO MATCH) ================= */

    @Transactional
    public String likeUser(Long from, Long to) {

        if (from.equals(to))
            return "Cannot like yourself";

        if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.LIKE))
            return "Already liked";

        relationRepository.save(UserRelation.of(from, to, RelationType.LIKE));

        boolean reverseLike = relationRepository.existsByFromUserIdAndToUserIdAndType(to, from, RelationType.LIKE);

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

    /* ================= GET MATCHED USERS ================= */

    public List<UserRelation> getMatchedUsers(Long userId) {
        // Find relations where this user is the "toUser" or "fromUser" and type is
        // MATCH
        List<UserRelation> matches = relationRepository.findByFromUserIdAndType(userId, RelationType.MATCH);
        return matches;
    }

    /* ================= GET RECEIVED REQUESTS ================= */

    public List<UserRelation> getReceivedRequests(Long userId) {
        return relationRepository.findByToUserIdAndType(userId, RelationType.REQUEST);
    }

    /* ================= REQUESTS ================= */

    public void sendRequest(Long from, Long to) {

        if (relationRepository.existsByFromUserIdAndToUserIdAndType(from, to, RelationType.REQUEST))
            return;

        UserRelation r = new UserRelation();
        r.setFromUserId(from);
        r.setToUserId(to);
        r.setType(RelationType.REQUEST);

        relationRepository.save(r);

        // Notify recipient in real-time
        try {
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "NEW_MATCH_REQUEST");
            payload.put("fromUserId", from);
            payload.put("toUserId", to);

            messagingTemplate.convertAndSend("/topic/notifications/" + to, payload);
        } catch (Exception e) {
            System.err.println("Failed to send real-time notification: " + e.getMessage());
        }
    }

    @Transactional
    public void rejectRequest(Long from, Long to) {
        // A rejected request means we just delete the pending REQUEST relation
        relationRepository.deleteBetweenUsers(from, to, RelationType.REQUEST);
        relationRepository.deleteBetweenUsers(to, from, RelationType.REQUEST);
    }

}
