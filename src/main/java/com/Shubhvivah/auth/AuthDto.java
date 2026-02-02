package com.Shubhvivah.auth;

import lombok.Data;

@Data
public class AuthDto {

    private String email;
    private String mobile;
    private String otp;
    private String password;
    private String confirmPassword;

    //token

    private String token;
}