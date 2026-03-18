package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.Data;

@Data
public class GoogleLoginRequestDto {
    private String idToken;
    private String email;
    private String fullName;
    private String profileImageUrl;
}
