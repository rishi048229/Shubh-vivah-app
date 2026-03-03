package com.example.shubhvivah.Vendor.Entity;

import com.example.shubhvivah.Vendor.Enums.ConversationType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long vendorId;

    private Long serviceRequestId;

    @Enumerated(EnumType.STRING)
    private ConversationType type;

    private boolean chatEnabled;
}