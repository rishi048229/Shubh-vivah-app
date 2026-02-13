package com.Shubhvivah.support;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ticketId;

    private Long senderId;

    private boolean adminMessage;

    @Column(length = 5000)
    private String message;

    private LocalDateTime sentAt;
}
