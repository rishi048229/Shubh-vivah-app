package com.example.shubhvivah.Authentication.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

import com.example.shubhvivah.Authentication.Dto.ResponseDto.ResendOtpResponse;
import com.example.shubhvivah.Authentication.Entity.OtpEntity;
import com.example.shubhvivah.Authentication.Entity.UserEntity;
import com.example.shubhvivah.Authentication.Repository.OtpRepository;
import com.example.shubhvivah.Authentication.Repository.UserRepository;
import com.example.shubhvivah.Authentication.Service.EmailService;
import com.example.shubhvivah.Authentication.exception.OtpException;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_RESEND_ATTEMPTS = 3;
    private static final int MAX_VERIFY_ATTEMPTS = 3;
    private static final int COOLDOWN_MINUTES = 2;

    private final SecureRandom secureRandom = new SecureRandom();

    // =====================================================
    // GENERATE OTP
    // =====================================================

    public String generateOtp(Long userId) {

        UserEntity user = getUser(userId);

        // Clean up any existing active OTPs for this user
        otpRepository.deleteByUser(user);

        String rawOtp = generateSecureOtp();

        OtpEntity entity = OtpEntity.builder()
                .user(user)
                .otpCode(passwordEncoder.encode(rawOtp))
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .used(false)
                .attemptCount(0)
                .resendCount(0)
                .lastSentAt(LocalDateTime.now())
                .build();

        otpRepository.save(entity);

        return rawOtp;
    }

    // =====================================================
    // VERIFY OTP
    // =====================================================

    // Separate method for registration OTP verification
    public void verifyRegistrationOtp(Long userId, String otp) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new OtpException("User not found", 0, 0));

        OtpEntity otpEntity = getActiveOtp(user);
        
        validateExpiry(otpEntity, user);
        validateOtpMatch(otpEntity, otp, user);

        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);
        
        user.setVerified(true);
        userRepository.save(user);
    }

    // Separate method for login OTP verification
    public void verifyLoginOtp(Long userId, String otp) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new OtpException("User not found", 0, 0));

        if (!user.isVerified()) {
            throw new OtpException("User not verified. Please complete registration first.", 0, 0);
        }

        OtpEntity otpEntity = getActiveOtp(user);
        
        validateExpiry(otpEntity, user);
        validateOtpMatch(otpEntity, otp, user);

        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);
    }

    // =====================================================
    // RESEND OTP
    // =====================================================

    public ResendOtpResponse resendAndBuildResponse(String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OtpException("User not found", 0, 0));

        OtpEntity otp = getActiveOtp(user);

        validateResend(otp, user);

        otp.setResendCount(otp.getResendCount() + 1);
        otp.setLastSentAt(LocalDateTime.now());
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));

        String newOtp = generateSecureOtp();
        otp.setOtpCode(passwordEncoder.encode(newOtp));
        otp.setUsed(false);

        otpRepository.save(otp);

        // Send the new OTP via email
        emailService.sendOtpEmail(user.getEmail(), newOtp);

        return new ResendOtpResponse(
                "OTP resent successfully",
                true,
                getRemainingResendAttempts(user),
                getCooldownSeconds(user)
        );
    }

    // =====================================================
    // VALIDATION METHODS (SRP Applied)
    // =====================================================

    private void validateExpiry(OtpEntity otp, UserEntity user) {
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new OtpException("OTP has expired.",
                    getRemainingResendAttempts(user),
                    0);
        }
    }

    private void validateOtpMatch(OtpEntity otp, String enteredOtp, UserEntity user) {

        if (!passwordEncoder.matches(enteredOtp, otp.getOtpCode())) {
            otp.setAttemptCount(otp.getAttemptCount() + 1);

            if (otp.getAttemptCount() >= MAX_VERIFY_ATTEMPTS) {
                otp.setUsed(true);
                throw new OtpException("Maximum verification attempts exceeded.",
                        getRemainingResendAttempts(user),
                        0);
            }

            throw new OtpException("Invalid OTP.",
                    getRemainingResendAttempts(user),
                    getCooldownSeconds(user));
        }

        // ✅ If OTP is correct → reset attempts
        otp.setAttemptCount(0);
    }

    private void validateResend(OtpEntity otp, UserEntity user) {

        if (otp.getResendCount() >= MAX_RESEND_ATTEMPTS) {
            throw new OtpException("Maximum resend attempts exceeded.",
                    0,
                    getCooldownSeconds(user));
        }

        long cooldown = getCooldownSeconds(user);

        if (cooldown > 0) {
            throw new OtpException("Please wait before requesting another OTP.",
                    getRemainingResendAttempts(user),
                    cooldown);
        }
    }

    // =====================================================
    // HELPERS
    // =====================================================

    private UserEntity getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new OtpException("User not found", 0, 0));
    }

    private OtpEntity getActiveOtp(UserEntity user) {
        return otpRepository
                .findTopByUserAndUsedFalseOrderByExpiryTimeDesc(user)
                .orElseThrow(() ->
                        new OtpException("No active OTP found.", 0, 0));
    }

    private String generateSecureOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    public int getRemainingResendAttempts(UserEntity user) {
        return otpRepository
                .findTopByUserAndUsedFalseOrderByExpiryTimeDesc(user)
                .map(o -> Math.max(0, MAX_RESEND_ATTEMPTS - o.getResendCount()))
                .orElse(MAX_RESEND_ATTEMPTS);
    }

    public long getCooldownSeconds(UserEntity user) {
        return otpRepository
                .findTopByUserAndUsedFalseOrderByExpiryTimeDesc(user)
                .filter(o -> o.getLastSentAt() != null)
                .map(o -> {
                    long secondsSinceLastSent =
                            Duration.between(o.getLastSentAt(), LocalDateTime.now()).getSeconds();

                    long cooldownSeconds = COOLDOWN_MINUTES * 60;

                    return secondsSinceLastSent < cooldownSeconds
                            ? cooldownSeconds - secondsSinceLastSent
                            : 0L;
                })
                .orElse(0L);
    }



}