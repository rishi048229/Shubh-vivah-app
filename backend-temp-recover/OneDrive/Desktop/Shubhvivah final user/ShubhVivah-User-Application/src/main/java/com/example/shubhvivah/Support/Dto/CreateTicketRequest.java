package com.example.shubhvivah.Support.Dto;

import com.example.shubhvivah.Support.enums.TicketPriority;
import lombok.Data;

@Data
public class CreateTicketRequest {
    private String subject;
    private String message;
    private TicketPriority priority;
}
