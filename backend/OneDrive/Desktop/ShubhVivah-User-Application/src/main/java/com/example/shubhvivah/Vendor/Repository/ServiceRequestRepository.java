package com.example.shubhvivah.Vendor.Repository;

import com.example.shubhvivah.Vendor.Entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestRepository
        extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByUserId(Long userId);

    boolean existsByUserIdAndVendorId(Long userId, Long vendorId);

    Optional<ServiceRequest> findTopByUserIdAndVendorIdOrderByCreatedAtDesc(Long userId, Long vendorId);

    Optional<ServiceRequest> findTopByVendorIdAndUserIdOrderByCreatedAtDesc(Long vendorId, Long userId);
}