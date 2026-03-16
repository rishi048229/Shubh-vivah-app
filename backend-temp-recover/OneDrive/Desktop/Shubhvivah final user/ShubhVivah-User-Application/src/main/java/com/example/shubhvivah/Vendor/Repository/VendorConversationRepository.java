package com.example.shubhvivah.Vendor.Repository;

import com.example.shubhvivah.Vendor.Entity.VendorConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorConversationRepository
        extends JpaRepository<VendorConversation, Long> {
}