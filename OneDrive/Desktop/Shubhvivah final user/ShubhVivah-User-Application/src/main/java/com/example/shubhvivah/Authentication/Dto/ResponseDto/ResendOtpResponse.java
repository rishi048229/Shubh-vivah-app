package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResendOtpResponse {
    private String message;
    private boolean success;
    private int remainingAttempts;
    private long cooldownSeconds;
}
