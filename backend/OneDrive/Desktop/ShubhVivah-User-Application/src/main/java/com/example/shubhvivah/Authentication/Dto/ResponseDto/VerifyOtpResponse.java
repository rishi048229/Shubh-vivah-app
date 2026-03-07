package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class VerifyOtpResponse {

    private Long userId;
    private String token;
    private String message;
}
