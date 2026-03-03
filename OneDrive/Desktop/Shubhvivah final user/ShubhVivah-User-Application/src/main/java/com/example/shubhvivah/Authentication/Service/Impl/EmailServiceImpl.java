package com.example.shubhvivah.Authentication.Service.Impl;

import com.example.shubhvivah.Authentication.Service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Autowired
    private final JavaMailSender mailSender;


    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("support@shubhvivah.ltd");
        message.setTo(email);
        message.setSubject("ShubhVivah OTP Verification");
        message.setText("Your OTP is: " + otp + " (valid for 5 minutes)");

        mailSender.send(message);
    }


    @Override
    public void sendResetPasswordEmail(String to, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("");
        message.setTo(to);
        message.setSubject("Reset Your Password");
        message.setText(
                "Click the link below to reset your password:\n\n"
                        + resetLink
                        + "\n\nThis link will expire in 15 minutes."
        );

        mailSender.send(message);
    }
}
