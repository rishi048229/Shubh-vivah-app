package com.Shubhvivah.Settings;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService service;

    @Autowired
    private AccountDeletionService deletionService;

    /* ================= DELETE ACCOUNT ================= */

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount() {

        Long userId = getCurrentUserId();

        deletionService.deleteAccount(userId);

        return ResponseEntity.ok("Account deleted permanently");
    }

    /* ================= AUTH HELPER ================= */

    private Long getCurrentUserId() {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated())
            throw new IllegalStateException("User not authenticated");

        Object principal = auth.getPrincipal();

        if (principal instanceof Long id)
            return id;

        if (principal instanceof String s)
            return Long.parseLong(s);

        throw new IllegalStateException("Invalid authentication principal");
    }

    /* ================= GET SETTINGS ================= */

    @GetMapping
    public ResponseEntity<UserSettings> get() {
        return ResponseEntity.ok(service.getSettings(getUserId()));
    }

    /* ================= UPDATE SETTINGS ================= */

    @PutMapping
    public ResponseEntity<String> update(@RequestBody SettingsDto dto) {
        service.updateSettings(getUserId(), dto);
        return ResponseEntity.ok("Settings updated");
    }

    /* ================= AUTH HELPER ================= */

    private Long getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();

        if (principal instanceof String s)
            return Long.parseLong(s);

        if (principal instanceof Long l)
            return l;

        throw new RuntimeException("Invalid user");
    }
}
