package com.Shubhvivah.support;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ticketId;

    private Long messageId;

    private String fileName;

    private String fileUrl;

    private String fileType; // IMAGE / FILE
}
