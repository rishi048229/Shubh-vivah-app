package com.example.shubhvivah.Authentication.Service;

import com.example.shubhvivah.Authentication.Dto.RequestDto.ForgotPasswordRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.LoginRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.RegisterRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.ResetPasswordRequestDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.LoginResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.PasswordResponseDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.RegisterResponseDto;

import com.example.shubhvivah.Authentication.Dto.RequestDto.GoogleLoginRequestDto;
import com.example.shubhvivah.Authentication.Dto.RequestDto.AddPhoneRequestDto;
import com.example.shubhvivah.Authentication.Dto.ResponseDto.GoogleLoginResponseDto;

public interface UserService {

    RegisterResponseDto register(RegisterRequestDto dto);

    LoginResponseDto login(LoginRequestDto dto);

    public LoginResponseDto verifyLoginOtp(Long userId, String otp);

    PasswordResponseDto forgotPassword(ForgotPasswordRequestDto dto);

    PasswordResponseDto resetPassword(ResetPasswordRequestDto dto);

    RegisterResponseDto verifyRegistrationOtp(Long userId, String otp);

    GoogleLoginResponseDto googleLogin(GoogleLoginRequestDto dto);

    GoogleLoginResponseDto addPhoneNumber(AddPhoneRequestDto dto);
}
