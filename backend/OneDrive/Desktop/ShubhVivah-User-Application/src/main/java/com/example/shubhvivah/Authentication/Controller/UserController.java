package com.example.shubhvivah.Authentication.Controller;

import com.example.shubhvivah.Authentication.Dto.RequestDto.*;
import com.example.shubhvivah.Authentication.Dto.RequestDto.VerifyOtpRequest;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.LoginResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.PasswordResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.RegisterResponseDto;
import com.example.shubhvivah.Authentication.Service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(
            @RequestBody RegisterRequestDto dto) {

        return ResponseEntity.ok(userService.register(dto));
    }

    @PostMapping("/login")
        public ResponseEntity<LoginResponseDto> login(
                @RequestBody LoginRequestDto dto) {

            LoginResponseDto response = userService.login(dto);
            return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResponseDto> forgotPassword(
            @RequestBody ForgotPasswordRequestDto dto) {

        return ResponseEntity.ok(userService.forgotPassword(dto));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResponseDto> resetPassword(
            @RequestBody ResetPasswordRequestDto dto) {

        return ResponseEntity.ok(userService.resetPassword(dto));
    }

    @PostMapping("/verify-registration-otp")
    public ResponseEntity<RegisterResponseDto> verifyRegistrationOtp(
            @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(userService.verifyRegistrationOtp(request.getUserId(), request.getOtp()));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<LoginResponseDto> verifyLoginOtp(
            @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(userService.verifyLoginOtp(request.getUserId(), request.getOtp()));
    }

}
