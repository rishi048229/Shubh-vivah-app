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

@GetMapping("/liked")
public List<UserRelation> likedUsers() {
    return service.getLikedUsers(service.getCurrentUserId());
}

@GetMapping("/shortlisted")
public List<UserRelation> shortlistedUsers() {
    return service.getShortlistedUsers(service.getCurrentUserId());
}

@GetMapping("/blocked")
public List<UserRelation> blockedUsers() {
    return service.getBlockedUsers(service.getCurrentUserId());
}
@PostMapping("/explore/report/{userId}")
public String report(
        @PathVariable Long userId,
        @RequestParam String reason) {

    service.reportUser(service.getCurrentUserId(), userId, reason);
    return "User reported successfully";
}


}
