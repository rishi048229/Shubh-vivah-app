package com.example.shubhvivah.Vendor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.shubhvivah.Vendor.Service.ServiceRequestService;
import com.example.shubhvivah.Vendor.Dto.CreateServiceRequestDto;

@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService service;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody CreateServiceRequestDto dto) {

        service.createRequest(getCurrentUserId(), dto);

        return ResponseEntity.ok("Request sent");
    }

    // webhook endpoint (vendor app calls this)
    @PatchMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id) {

        service.acceptRequest(id);

        return ResponseEntity.ok("Request accepted");
    }
}