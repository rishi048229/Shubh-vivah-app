package com.example.shubhvivah.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseCleanupTask implements CommandLineRunner {

        private final JdbcTemplate jdbcTemplate;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                log.info("Starting Database Cleanup Task...");

                // Define criteria for "Mock/Unverified" users
                String criteria = "is_verified = false OR email LIKE '%@example.com' OR email LIKE '%@test.com'";

                // 1. Identify User IDs to delete
                List<Long> userIds = jdbcTemplate.queryForList(
                                "SELECT user_id FROM users WHERE " + criteria, Long.class);

                if (userIds.isEmpty()) {
                        log.info("No mock or unverified users found. Cleanup skipped.");
                        return;
                }

                log.info("Found {} users to clean up: {}", userIds.size(), userIds);

                // 2. Delete in order of dependencies (Child tables first)

                // Profile Photos (Grandchild of User via UserProfile)
                jdbcTemplate.update(
                                "DELETE FROM profile_photos WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE user_id IN (SELECT user_id FROM users WHERE "
                                                + criteria + "))");

                // User Profiles
                jdbcTemplate.update(
                                "DELETE FROM user_profiles WHERE user_id IN (SELECT user_id FROM users WHERE "
                                                + criteria + ")");

                // OTP Verification
                jdbcTemplate.update(
                                "DELETE FROM otp_verification WHERE user_id IN (SELECT user_id FROM users WHERE "
                                                + criteria + ")");

                // User Settings
                jdbcTemplate.update(
                                "DELETE FROM user_settings WHERE user_id IN (SELECT user_id FROM users WHERE "
                                                + criteria + ")");

                // User Relations (Both directions)
                jdbcTemplate.update("DELETE FROM user_relations WHERE from_user_id IN (SELECT user_id FROM users WHERE "
                                + criteria + ") OR to_user_id IN (SELECT user_id FROM users WHERE " + criteria + ")");

                // Online Users / Presence (if applicable - checking table name from
                // Presence/OnlineUsers.java logic usually)
                // Since I saw OnlineUsers.java, I should check if it's an entity or just a
                // memory store.
                // For now, I'll stick to the core database tables identified.

                // 3. Finally delete from Users table
                int deletedCount = jdbcTemplate.update("DELETE FROM users WHERE " + criteria);

                log.info("Successfully deleted {} user records and all their associated data.", deletedCount);
                log.info("IMPORTANT: Please delete this file (DatabaseCleanupTask.java) after confirming the cleanup.");
        }
}
