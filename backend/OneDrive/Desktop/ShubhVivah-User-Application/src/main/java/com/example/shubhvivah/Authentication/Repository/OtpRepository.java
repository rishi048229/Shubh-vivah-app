package com.example.shubhvivah.Authentication.Repository;

import com.example.shubhvivah.Authentication.Entity.OtpEntity;
import com.example.shubhvivah.Authentication.Entity.UserEntity;
import org.apache.tomcat.util.http.MimeHeaders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpEntity, Long> {

    // Find valid unused OTP for a user
    Optional<OtpEntity> findByUserAndOtpCodeAndUsedFalse(
            UserEntity user,
            String otpCode
    );

    // Optional: clean up expired OTPs (good for cron job later)
    void deleteByExpiryTimeBefore(LocalDateTime time);

    // Optional: invalidate old OTPs when generating a new one
    void deleteByUser(UserEntity user);

    Optional<OtpEntity> findTopByUserAndUsedFalseOrderByExpiryTimeDesc(UserEntity user);
}
