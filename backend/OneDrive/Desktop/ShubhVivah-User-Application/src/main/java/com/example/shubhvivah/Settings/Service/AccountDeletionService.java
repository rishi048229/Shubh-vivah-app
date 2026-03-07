package com.example.shubhvivah.Settings.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shubhvivah.Chat.Repository.ChatMessageRepository;
import com.example.shubhvivah.profile.repository.ProfilePhotoRepository;
import com.example.shubhvivah.Matchmaking.Repository.*;
import com.example.shubhvivah.Matchmaking.Repository.UserRelationRepository;
import com.example.shubhvivah.Authentication.Repository.UserRepository;
import com.example.shubhvivah.Settings.Repository.SettingsRepository;
import com.example.shubhvivah.profile.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountDeletionService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final ProfilePhotoRepository photoRepo;
    private final UserRelationRepository relationRepo;
    private final ChatMessageRepository chatRepo;
    private final SettingsRepository settingsRepo;

    @Transactional
    public void deleteAccount(Long userId) {

        /* ================= DELETE CHATS ================= */
        chatRepo.deleteAllByUser(userId);

        /*
         * ================= DELETE MATCHES / LIKES / BLOCK / REQUEST =================
         */
        relationRepo.deleteAllByUser(userId);

        /* ================= DELETE PROFILE PHOTOS ================= */
        photoRepo.deleteAllByUserId(userId);

        /* ================= DELETE PROFILE ================= */
        profileRepo.deleteByUserId(userId);

        /* ================= DELETE SETTINGS ================= */
        settingsRepo.deleteById(userId);

        /* ================= DELETE USER ================= */
        userRepo.deleteById(userId);
    }
}
