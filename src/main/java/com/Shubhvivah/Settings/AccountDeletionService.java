package com.Shubhvivah.Settings;

import com.Shubhvivah.auth.UserRepository;
import com.Shubhvivah.chat.ChatMessageRepository;
import com.Shubhvivah.matchmaking.UserRelationRepository;
import com.Shubhvivah.profile.ProfilePhotoRepository;
import com.Shubhvivah.profile.ProfileRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountDeletionService {

    private final UserRepository userRepo;
    private final ProfileRepository profileRepo;
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
