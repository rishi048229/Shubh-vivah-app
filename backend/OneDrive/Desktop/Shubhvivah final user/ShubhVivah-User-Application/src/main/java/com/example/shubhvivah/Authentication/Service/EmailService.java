package com.example.shubhvivah.Authentication.Service;

public interface EmailService {

    void sendOtpEmail(String email, String otp);

    void sendResetPasswordEmail(String to, String resetLink);


}
