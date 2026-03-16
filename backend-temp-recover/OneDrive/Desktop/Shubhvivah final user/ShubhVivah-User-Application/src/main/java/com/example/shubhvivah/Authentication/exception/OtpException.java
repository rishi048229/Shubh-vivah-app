package com.example.shubhvivah.Authentication.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
public class OtpException extends RuntimeException {

    private final int remainingAttempts;
    private final long cooldownSeconds;

    public OtpException(String message, int remainingAttempts, long cooldownSeconds) {
        super(message);  // very important
        this.remainingAttempts = remainingAttempts;
        this.cooldownSeconds = cooldownSeconds;
    }
}
