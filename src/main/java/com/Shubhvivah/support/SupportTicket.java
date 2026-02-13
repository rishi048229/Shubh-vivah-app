package com.Shubhvivah.support;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.Shubhvivah.support.TicketStatus;

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
