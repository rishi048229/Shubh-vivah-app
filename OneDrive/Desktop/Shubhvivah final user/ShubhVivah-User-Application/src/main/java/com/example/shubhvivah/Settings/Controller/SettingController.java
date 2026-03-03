package com.example.shubhvivah.Settings.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.shubhvivah.Settings.Dto.SettingsDto;
import com.example.shubhvivah.Settings.Entity.UserSettings;
import com.example.shubhvivah.Settings.Service.AccountDeletionService;
import com.example.shubhvivah.Settings.Service.SettingsService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingController {

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

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated())
            throw new IllegalStateException("User not authenticated");

        Object principal = auth.getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        }

        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();

        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }

        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new RuntimeException("Invalid user");
    }
}
