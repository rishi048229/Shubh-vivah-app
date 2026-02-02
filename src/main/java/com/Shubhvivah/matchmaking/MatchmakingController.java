package com.Shubhvivah.matchmaking;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchmakingController {

    private final MatchmakingService service;

    @GetMapping
    public List<MatchmakingDto> getMatches(
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String religion,
            @RequestParam(required = false) String city) {

        return service.getMatches(minAge, maxAge, religion, city);
    }
    // 🔍 MANUAL SEARCH API
@GetMapping("/search")
public List<MatchmakingDto> searchMatches(
        @RequestParam(required = false) Integer minAge,
        @RequestParam(required = false) Integer maxAge,
        @RequestParam(required = false) String religion,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String maritalStatus
) {
    return service.searchMatches(
            minAge,
            maxAge,
            religion,
            city,
            maritalStatus
    );
}

}
