package com.example.shubhvivah.Support.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.example.shubhvivah.Support.enums.TicketStatus;
import com.example.shubhvivah.Support.enums.TicketPriority;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String subject;

    @Column(length = 5000)
    private String message;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    private LocalDateTime createdAt;
}
