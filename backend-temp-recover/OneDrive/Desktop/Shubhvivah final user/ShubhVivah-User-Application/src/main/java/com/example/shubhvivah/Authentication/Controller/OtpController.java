package com.example.shubhvivah.Authentication.Controller;

import com.example.shubhvivah.Authentication.Dto.ResponseDto.ResendOtpResponse;
import com.example.shubhvivah.Authentication.Dto.RequestDto.ResendOtpRequest;
import com.example.shubhvivah.Authentication.Service.OtpService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send/{userId}")
    public ResponseEntity<String> sendOtp(@PathVariable Long userId) {
        otpService.generateOtp(userId);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/resend")
    public ResponseEntity<ResendOtpResponse> resendOtp(
            @RequestBody ResendOtpRequest request) {

        return ResponseEntity.ok(
                otpService.resendAndBuildResponse(request.getEmail())
        );
    }
}