package com.example.shubhvivah.Matchmaking.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.*;
import com.example.shubhvivah.profile.entity.UserProfile;
import com.example.shubhvivah.Matchmaking.Service.MatchmakingService;
import com.example.shubhvivah.Matchmaking.Service.SearchService;
import com.example.shubhvivah.Matchmaking.Repository.UserRelationRepository;
import com.example.shubhvivah.Matchmaking.Entity.UserRelation;
import com.example.shubhvivah.Matchmaking.enums.RelationType;
import com.example.shubhvivah.Matchmaking.Dto.MatchmakingDto;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchmakingController {

    private final MatchmakingService service;
    private final SearchService searchService;
    private final UserRelationRepository relationRepository;

    /* ================= FULL PROFILE ================= */

    @GetMapping("/profile/{userId}")
    public MatchmakingDto viewFullProfile(@PathVariable Long userId) {
        return service.getFullProfile(userId);
    }

    /* ================= EXPLORE ================= */

    @GetMapping("/explore/next")
    public MatchmakingDto nextProfile() {
        return service.getNextProfile(service.getCurrentUserId());
    }

    @GetMapping("/explore/previous")
    public MatchmakingDto previousProfile() {
        return service.getPreviousProfile(service.getCurrentUserId());
    }

    @GetMapping("/explore/search")
    public org.springframework.http.ResponseEntity<List<MatchmakingDto>> searchProfiles(
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "minAge", required = false) Integer minAge,
            @RequestParam(name = "maxAge", required = false) Integer maxAge,
            @RequestParam(name = "religion", required = false) String religion,
            @RequestParam(name = "city", required = false) String city) {
        try {
            Long currentUserId = service.getCurrentUserId();
            List<MatchmakingDto> results = searchService.searchProfiles(currentUserId, query, minAge, maxAge, religion, city);
            return org.springframework.http.ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("=== CONTROLLER SEARCH ERROR ===");
            e.printStackTrace();
            System.err.println("=== END CONTROLLER SEARCH ERROR ===");
            return org.springframework.http.ResponseEntity.ok(java.util.List.of());
        }
    }

    @GetMapping("/explore/suggestions")
    public List<String> getSearchSuggestions(@RequestParam(name = "query", required = false, defaultValue = "") String query) {
        try {
            return searchService.getSuggestions(service.getCurrentUserId(), query);
        } catch (Exception e) {
            return java.util.List.of();
        }
    }

    // Temporary debug endpoint - remove after testing
    @GetMapping("/explore/test-search")
    public java.util.Map<String, Object> testSearch() {
        try {
            // Direct DB query without auth - just to verify data access works
            long totalProfiles = service.getProfileCount();
            java.util.Map<String, Object> response = new java.util.LinkedHashMap<>();
            response.put("status", "OK");
            response.put("totalProfilesInDB", totalProfiles);
            return response;
        } catch (Exception e) {
            java.util.Map<String, Object> response = new java.util.LinkedHashMap<>();
            response.put("status", "ERROR");
            response.put("error", e.getClass().getName() + ": " + e.getMessage());
            return response;
        }
    }

    /* ================= HOME SCREEN WIDGETS ================= */

    @GetMapping("/home/nearby")
    public List<MatchmakingDto> getNearbyMatches() {
        try {
            return searchService.getNearbyProfiles(service.getCurrentUserId());
        } catch (Exception e) {
            return java.util.List.of();
        }
    }

    @GetMapping("/home/best")
    public List<MatchmakingDto> getBestMatches() {
        return service.getBestMatches(service.getCurrentUserId());
    }

    @GetMapping("/home/new")
    public List<MatchmakingDto> getNewMatches() {
        return service.getNewMatches(service.getCurrentUserId());
    }

    /* ================= ACTIONS ================= */
    @PostMapping("/request/{toUserId}")
    public void sendRequest(@PathVariable Long toUserId) {
        Long fromUserId = service.getCurrentUserId(); // 🔥 FIX
        service.sendRequest(fromUserId, toUserId);
    }

    @PostMapping("/explore/shortlist/{userId}")
    public String shortlist(@PathVariable Long userId) {
        service.shortlistUser(service.getCurrentUserId(), userId);
        return "User shortlisted";
    }
    /* ================= LIKE ================= */

    @PostMapping("/explore/like/{userId}")
    public String like(@PathVariable Long userId) {
        service.likeUser(service.getCurrentUserId(), userId);
        return "User liked";
    }

    /* ================= SHORTLIST ================= */

    /* ================= BLOCK ================= */

    @PostMapping("/explore/block/{userId}")
    public String block(@PathVariable Long userId) {
        service.blockUser(service.getCurrentUserId(), userId);
        return "User blocked";
    }

    /* ================= UNBLOCK ================= */

    @PostMapping("/explore/unblock/{userId}")
    public String unblock(@PathVariable Long userId) {
        service.unblockUser(service.getCurrentUserId(), userId);
        return "User unblocked";
    }

    /* ================= LISTS ================= */
    /* ================= GET LIKED USERS ================= */

    @GetMapping("/liked")
    public List<UserRelation> likedUsers() {
        return service.getLikedUsers(service.getCurrentUserId());
    }

    /* ================= GET SHORTLISTED USERS ================= */

    @GetMapping("/shortlisted")
    public List<UserRelation> shortlistedUsers() {
        return service.getShortlistedUsers(service.getCurrentUserId());
    }

    /* ================= GET BLOCKED USERS ================= */

    @GetMapping("/blocked")
    public List<MatchmakingDto> blockedUsers() {
        return service.getBlockedUsers(service.getCurrentUserId());
    }

    /* ================= GET MATCHED USERS ================= */

    @GetMapping("/matched")
    public List<UserRelation> matchedUsers() {
        return service.getMatchedUsers(service.getCurrentUserId());
    }

    @GetMapping("/matched/profiles")
    public List<MatchmakingDto> matchedProfiles() {
        return service.getMatchedProfiles(service.getCurrentUserId());
    }

    /* ================= GET RECEIVED REQUESTS ================= */

    @GetMapping("/requests/received")
    public List<UserRelation> receivedRequests() {
        return service.getReceivedRequests(service.getCurrentUserId());
    }

    /* ================= REJECT MATCH REQUEST ================= */

    @PostMapping("/reject/{fromUserId}")
    public void rejectRequest(@PathVariable Long fromUserId) {
        Long me = service.getCurrentUserId();
        service.rejectRequest(fromUserId, me);
    }

    /* ================= REPORT USER ================= */

    @PostMapping("/report/{userId}")
    public String report(
            @PathVariable Long userId,
            @RequestParam(name = "reason") String reason) {

        service.reportUser(service.getCurrentUserId(), userId, reason);
        return "User reported successfully";
    }

    @PostMapping("/accept/{fromUserId}")
    @Transactional
    public void accept(@PathVariable Long fromUserId) {

        Long me = service.getCurrentUserId();

        // delete BOTH possible request directions (safe)
        relationRepository.deleteBetweenUsers(fromUserId, me, RelationType.REQUEST);
        relationRepository.deleteBetweenUsers(me, fromUserId, RelationType.REQUEST);

        // create MATCH both directions
        createMatch(fromUserId, me);
        createMatch(me, fromUserId);
    }

    private void createMatch(Long from, Long to) {

        boolean exists = relationRepository
                .existsByFromUserIdAndToUserIdAndType(from, to, RelationType.MATCH);

        if (!exists) {
            UserRelation r = new UserRelation();
            r.setFromUserId(from);
            r.setToUserId(to);
            r.setType(RelationType.MATCH);
            relationRepository.save(r);
        }
    }

    private void saveMatch(Long from, Long to) {
        UserRelation r = new UserRelation();
        r.setFromUserId(from);
        r.setToUserId(to);
        r.setType(RelationType.MATCH);
        relationRepository.save(r);
    }

    private Long getCurrentUserId() {

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        }

        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }

        throw new IllegalStateException("Invalid authentication principal");
    }

}
