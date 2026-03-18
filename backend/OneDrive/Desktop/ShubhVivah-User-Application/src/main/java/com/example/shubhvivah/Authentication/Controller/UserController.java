package com.example.shubhvivah.Authentication.Controller;

import com.example.shubhvivah.Authentication.Dto.RequestDto.*;
import com.example.shubhvivah.Authentication.Dto.RequestDto.VerifyOtpRequest;
import com.example.shubhvivah.Authentication.Dto.RequestDto.GoogleLoginRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.AddPhoneRequestDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.LoginResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.PasswordResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.RegisterResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.GoogleLoginResponseDto;
import com.example.shubhvivah.Authentication.Service.UserService;
import com.example.shubhvivah.Authentication.Service.Impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

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

    // ================= GOOGLE LOGIN =================
    @PostMapping("/google-login")
    public ResponseEntity<GoogleLoginResponseDto> googleLogin(
            @RequestBody GoogleLoginRequestDto dto) {
        return ResponseEntity.ok(userService.googleLogin(dto));
    }

    // ================= ADD PHONE =================
    @PostMapping("/add-phone")
    public ResponseEntity<GoogleLoginResponseDto> addPhone(
            @RequestBody AddPhoneRequestDto dto) {
        return ResponseEntity.ok(userService.addPhoneNumber(dto));
    }

}

