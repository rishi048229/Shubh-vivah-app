package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginResponseDto {
    private Long userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private boolean isPhoneVerified;
    private String token;
    private boolean isNewUser;
}
