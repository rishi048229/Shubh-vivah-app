package com.example.shubhvivah.Authentication.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.shubhvivah.Authentication.Dto.ResponseDto.ResendOtpResponse;

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(OtpException.class)
        public ResponseEntity<ResendOtpResponse> handleOtpException(OtpException ex) {

            ResendOtpResponse response = new ResendOtpResponse(
                    ex.getMessage(),
                    false,
                    ex.getRemainingAttempts(),
                    ex.getCooldownSeconds()
            );

            return ResponseEntity.badRequest().body(response);
        }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        // Log the actual error for debugging
        System.err.println("=== RUNTIME ERROR ===");
        ex.printStackTrace();
        System.err.println("=== END ERROR ===");
        return ResponseEntity.internalServerError().body("Internal server error: " + ex.getMessage());
    }

}
