package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.Data;

@Data
public class AddPhoneRequestDto {
    private Long userId;
    private String phoneNumber;
}
