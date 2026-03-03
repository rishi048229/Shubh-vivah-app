package com.example.shubhvivah.Vendor.Dto;

import lombok.Data;

@Data
public class CreateServiceRequestDto {

    private Long vendorId;
    private Long serviceId;
    private String message;
}