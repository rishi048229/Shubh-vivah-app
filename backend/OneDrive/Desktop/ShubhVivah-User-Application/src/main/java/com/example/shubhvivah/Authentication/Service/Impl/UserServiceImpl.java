package com.example.shubhvivah.Authentication.Service.Impl;

import com.example.shubhvivah.Authentication.Dto.RequestDto.ForgotPasswordRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.LoginRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.RegisterRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.ResetPasswordRequestDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.LoginResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.PasswordResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.RegisterResponseDto;
import com.example.shubhvivah.Authentication.Entity.UserEntity;
import com.example.shubhvivah.Authentication.Repository.UserRepository;
import com.example.shubhvivah.Authentication.Service.EmailService;
import com.example.shubhvivah.Authentication.Service.OtpService;
import com.example.shubhvivah.Authentication.Service.UserService;
import com.example.shubhvivah.Authentication.exception.OtpException;
import com.example.shubhvivah.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Value("${app.reset-password.base-url}")
    private String resetBaseUrl;

    private final OtpService otpService;


    // ================= REGISTER =================
    @Override
    public RegisterResponseDto register(RegisterRequestDto dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setVerified(false); // IMPORTANT

        userRepository.save(user);

        String otp = otpService.generateOtp(user.getUserId());
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new RegisterResponseDto(
                user.getUserId(),
                "OTP sent to email for verification",
                false
        );
    }

    public RegisterResponseDto verifyRegistrationOtp(Long userId, String otp) {

        System.out.println("=== UserServiceImpl.verifyRegistrationOtp() CALLED ===");
        System.out.println("Params: " + userId + " / " + otp);

        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new OtpException("User not found", 0, 0);
        }

        // Use the new separate registration OTP verification method
        otpService.verifyRegistrationOtp(userId, otp);

        String token = jwtUtil.generateToken(user.getUserId());

        return new RegisterResponseDto(
                user.getUserId(),
                token,
                true
        );
    }
    // ================= LOGIN =================
    @Override
    public LoginResponseDto login(LoginRequestDto dto) {

        UserEntity user = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (user == null ||
                !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified");
        }

        String otp = otpService.generateOtp(user.getUserId());
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new LoginResponseDto(
                user.getUserId(),
                null,
                "otp sent successfully"
                );
    }

    public LoginResponseDto verifyLoginOtp(Long userId, String otp) {

        System.out.println("=== UserServiceImpl.verifyLoginOtp() CALLED ===");
        System.out.println("Params: " + userId + " / " + otp);

        UserEntity user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Use the new separate login OTP verification method
        otpService.verifyLoginOtp(userId, otp);

        String token = jwtUtil.generateToken(user.getUserId());

        return new LoginResponseDto(
                user.getUserId(),
                token,
                "Login successful"
        );
    }

    @Override
    public PasswordResponseDto forgotPassword(ForgotPasswordRequestDto dto) {

        UserEntity user = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String resetToken = UUID.randomUUID().toString();

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        String resetLink = resetBaseUrl + "?token=" + resetToken;

        emailService.sendResetPasswordEmail(
                user.getEmail(),
                resetLink
        );

        return new PasswordResponseDto(
                "Password reset link sent to your email",
                true
        );
    }

    // ================= RESET PASSWORD =================
    @Override
    public PasswordResponseDto resetPassword(ResetPasswordRequestDto dto) {

        UserEntity user = userRepository.findByResetToken(dto.getToken());

        if (user == null) {
            throw new RuntimeException("Invalid reset token");
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return new PasswordResponseDto(
                "Password reset successful",
                true
        );
    }
}
