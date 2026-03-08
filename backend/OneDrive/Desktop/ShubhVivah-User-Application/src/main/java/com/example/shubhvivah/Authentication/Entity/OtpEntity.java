package com.example.shubhvivah.Authentication.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "otp_verification")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "attempt_count", nullable = false)
    @Builder.Default
    private int attemptCount = 0;          // for verify attempts
    
    @Column(name = "resend_count", nullable = false)
    @Builder.Default
    private int resendCount = 0;           // for resend limit
    
    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;      // cooldown tracking

    @Column(name = "is_used", nullable = false)
    private boolean used;


}
