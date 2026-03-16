package com.Shubhvivah.auth;


import com.Shubhvivah.common.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OtpRepository otpRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // SEND OTP
    public void sendOtp(AuthDto dto) {

        UserEntity user = findOrCreateUser(dto);

        String otp = Util.generateOtp();

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);

        otpRepo.save(otpEntity);

        // DEMO
        System.out.println("OTP = " + otp);
    }

    // VERIFY OTP
    public void verifyOtp(AuthDto dto) {

        UserEntity user = findUser(dto);

        OtpEntity otp = otpRepo
                .findByUserAndOtpCodeAndUsedFalse(user, dto.getOtp());

        if (otp == null) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        otp.setUsed(true);
        otpRepo.save(otp);

        user.setVerified(true);
        userRepo.save(user);
    }

    public void setPassword(AuthDto dto) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        UserEntity user = findUser(dto);

        if (!user.isVerified()) {
            throw new RuntimeException("User not verified");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        userRepo.save(user);
    }


    public String login(AuthDto dto) {

        UserEntity user = findUser(dto);

        if (user.getPasswordHash() == null) {
            throw new RuntimeException("Password not set");
        }

        if (!passwordEncoder.matches(
                dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return Util.generateJwt(user.getUserId());
    }

  
    private UserEntity findUser(AuthDto dto) {

        UserEntity user = null;

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user = userRepo.findByEmail(dto.getEmail().trim());
        }
        else if (dto.getMobile() != null && !dto.getMobile().isBlank()) {

            String mobile = dto.getMobile()
                    .trim()
                    .replaceAll("\\s+", "");

            user = userRepo.findByMobile(mobile);
        }
        else {
            throw new RuntimeException("Email or mobile required");
        }

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

//--------------find or create user----------------
    
    private UserEntity findOrCreateUser(AuthDto dto) {

        UserEntity user = null;

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user = userRepo.findByEmail(dto.getEmail().trim());
        }

        if (user == null && dto.getMobile() != null && !dto.getMobile().isBlank()) {
            String mobile = dto.getMobile().trim().replaceAll("\\s+", "");
            user = userRepo.findByMobile(mobile);
        }

        if (user != null) {
            return user;
        }

        // CREATE NEW USER ONLY IF NOT EXISTS
        user = new UserEntity();
        user.setEmail(dto.getEmail());
        user.setMobile(dto.getMobile());
        user.setVerified(false);

        return userRepo.save(user);
    }

   //--------------RESET PASSWORD LOGIC----------
    
    
    public void sendForgotPasswordOtp(AuthDto dto) {

        UserEntity user = findUser(dto);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("User not verified");
        }

        String otp = Util.generateOtp();

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);

        otpRepo.save(otpEntity);

        // DEMO
        if (dto.getEmail() != null) {
            System.out.println("Forgot Password OTP sent to EMAIL: " + otp);
        } else {
            System.out.println("Forgot Password OTP sent to MOBILE: " + otp);
        }
    }

    
    public void verifyForgotPasswordOtp(AuthDto dto) {

        UserEntity user = findUser(dto);

        OtpEntity otp = otpRepo
                .findByUserAndOtpCodeAndUsedFalse(user, dto.getOtp());

        if (otp == null) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        otp.setUsed(true);
        otpRepo.save(otp);
    }



    public void resetPassword(AuthDto dto) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        validatePassword(dto.getPassword());

        UserEntity user = findUser(dto);

        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        userRepo.save(user);
    }

    //---TO KEEP THE PASSWORD TO A CERTAIN LENGTH----
    private void validatePassword(String password) {

        if (password.length() < 8)
            throw new RuntimeException("Password must be at least 8 characters");

        if (!password.matches(".*[A-Z].*"))
            throw new RuntimeException("Password must contain uppercase letter");

        if (!password.matches(".*[a-z].*"))
            throw new RuntimeException("Password must contain lowercase letter");

        if (!password.matches(".*\\d.*"))
            throw new RuntimeException("Password must contain a number");

        if (!password.matches(".*[@#$%^&+=!].*"))
            throw new RuntimeException("Password must contain special character");

        if (password.contains(" "))
            throw new RuntimeException("Password must not contain spaces");
    }
//


}
