package com.example.shubhvivah.Authentication.Dto.ResponseDto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponseDto {

        private Long userId;
        private String message;
        private Boolean isVerified;



}
