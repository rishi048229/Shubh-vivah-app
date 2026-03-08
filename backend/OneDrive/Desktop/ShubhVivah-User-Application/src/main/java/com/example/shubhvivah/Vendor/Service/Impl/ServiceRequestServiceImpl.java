package com.example.shubhvivah.Vendor.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.shubhvivah.Vendor.Entity.ServiceRequest;
import com.example.shubhvivah.Vendor.Entity.VendorConversation;
import com.example.shubhvivah.Vendor.Repository.ServiceRequestRepository;
import com.example.shubhvivah.Vendor.Repository.VendorConversationRepository;
import com.example.shubhvivah.Vendor.Dto.CreateServiceRequestDto;
import com.example.shubhvivah.Vendor.Enums.ConversationType;
import com.example.shubhvivah.Vendor.Enums.RequestStatus;
import com.example.shubhvivah.Vendor.Service.ServiceRequestService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository requestRepo;
    private final VendorConversationRepository conversationRepo;

    @Override
    public void createRequest(Long userId, CreateServiceRequestDto dto) {

        ServiceRequest request = ServiceRequest.builder()
                .userId(userId)
                .vendorId(dto.getVendorId())
                .serviceId(dto.getServiceId())
                .message(dto.getMessage())
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        requestRepo.save(request);

        VendorConversation conversation = VendorConversation.builder()
                .userId(userId)
                .vendorId(dto.getVendorId())
                .serviceRequestId(request.getId())
                .type(ConversationType.USER_VENDOR)
                .chatEnabled(false)
                .build();

        conversationRepo.save(conversation);
    }

    // Called by vendor system webhook/API
    @Override
    public void acceptRequest(Long requestId) {

        ServiceRequest request = requestRepo.findById(requestId)
                .orElseThrow();

        request.setStatus(RequestStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());

        requestRepo.save(request);

        VendorConversation conversation = conversationRepo.findAll().stream()
                .filter(c -> c.getServiceRequestId().equals(requestId))
                .findFirst()
                .orElseThrow();

        conversation.setChatEnabled(true);

        conversationRepo.save(conversation);
    }
}