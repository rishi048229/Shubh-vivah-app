package com.example.shubhvivah.Authentication.Dto.RequestDto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResendOtpRequest {
    private String email;
}
