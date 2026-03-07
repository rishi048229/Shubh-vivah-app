package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {

    private long id;
    private String token;
    private String message;
}
