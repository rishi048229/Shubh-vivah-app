package com.example.shubhvivah.Vendor.Service;

import com.example.shubhvivah.Vendor.Dto.CreateServiceRequestDto;

public interface ServiceRequestService {

    void createRequest(Long userId, CreateServiceRequestDto dto);

    void acceptRequest(Long requestId);
}