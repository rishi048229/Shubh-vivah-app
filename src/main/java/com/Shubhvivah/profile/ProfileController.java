package com.Shubhvivah.profile;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /*
     * CREATE / UPDATE PROFILE
     */
    @PostMapping
    public ResponseEntity<String> saveOrUpdateProfile(
            @Valid @RequestBody ProfileDto profileDto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        profileService.saveOrUpdateProfile(userId, profileDto);

        return ResponseEntity.ok("Profile saved or updated successfully");
    }

    /*
     * GET PROFILE
     */
    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(profileService.getProfile(userId));
    }
  

}
