package com.Shubhvivah.chat;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long receiverId;

    @Column(length = 2000)
    private String content; 

    @Column(length = 2000)
    private String message;

    private String imageUrl;

    private LocalDateTime sentAt = LocalDateTime.now();
    private boolean deleted;

    private boolean delivered;
    private boolean seen;
    private String type;
    
private LocalDateTime seenAt;

}
