package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {

    private String token;
    private String newPassword;
}
