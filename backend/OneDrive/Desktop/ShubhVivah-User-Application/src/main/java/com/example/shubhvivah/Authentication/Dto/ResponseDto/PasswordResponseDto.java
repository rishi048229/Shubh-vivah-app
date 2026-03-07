package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResponseDto {

    private String message;
    private boolean success;
}
