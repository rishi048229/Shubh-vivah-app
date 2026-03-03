package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpRequest {
    private Long userId;
    private String otp;
}
