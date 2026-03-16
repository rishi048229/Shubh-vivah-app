package com.Shubhvivah.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepository extends JpaRepository<OtpEntity, Long> {

    OtpEntity findByUserAndOtpCodeAndUsedFalse(
            UserEntity user,
            String otpCode
    );
}
