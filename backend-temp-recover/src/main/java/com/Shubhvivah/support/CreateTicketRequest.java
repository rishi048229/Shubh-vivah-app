package com.Shubhvivah.support;

import lombok.Data;

@Data
public class CreateTicketRequest {
    private String subject;
    private String message;
    private TicketPriority priority;
}
