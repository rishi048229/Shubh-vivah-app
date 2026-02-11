package com.Shubhvivah.matchmaking;
import java.util.List;


import org.springframework.web.bind.annotation.PathVariable;


import org.springframework.web.bind.annotation.*;
import com.Shubhvivah.profile.ProfileEntity;
import lombok.RequiredArgsConstructor;





@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchmakingController {

    private final MatchmakingService service;
    private final UserRelationRepository relationRepository;

    /* ================= FULL PROFILE ================= */

    @GetMapping("/profile/{userId}")
    public ProfileEntity viewFullProfile(@PathVariable Long userId) {
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

    /* ================= ACTIONS ================= */
    @PostMapping("/request/{toUserId}")
    public void sendRequest(@PathVariable Long toUserId) {
        Long fromUserId = service.getCurrentUserId();   // 🔥 FIX
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
public List<UserRelation> blockedUsers() {
    return service.getBlockedUsers(service.getCurrentUserId());
}

/* ================= REPORT USER ================= */

@PostMapping("/report/{userId}")
public String report(
        @PathVariable Long userId,
        @RequestParam String reason) {

    service.reportUser(service.getCurrentUserId(), userId, reason);
    return "User reported successfully";
}
@PostMapping("/accept/{fromUserId}")
public void accept(@PathVariable Long fromUserId) {

    Long me = service.getCurrentUserId();

    // delete BOTH possible request directions (safe)
    relationRepository.deleteBetweenUsers(fromUserId, me, RelationType.REQUEST);
    relationRepository.deleteBetweenUsers(me, fromUserId, RelationType.REQUEST);

    // create MATCH both directions
    relationRepository.save(UserRelation.of(fromUserId, me, RelationType.MATCH));
    relationRepository.save(UserRelation.of(me, fromUserId, RelationType.MATCH));
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

    var auth = org.springframework.security.core.context.SecurityContextHolder
            .getContext()
            .getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new IllegalStateException("User not authenticated");
    }

    Object principal = auth.getPrincipal();

    if (principal instanceof Long id) {
        return id;
    }

    if (principal instanceof String s) {
        return Long.parseLong(s);
    }

    throw new IllegalStateException("Invalid authentication principal");
}


}
