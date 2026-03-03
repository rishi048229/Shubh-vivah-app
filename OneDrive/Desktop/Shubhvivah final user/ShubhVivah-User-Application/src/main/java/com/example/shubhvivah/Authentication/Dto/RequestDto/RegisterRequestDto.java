package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String password;

}
