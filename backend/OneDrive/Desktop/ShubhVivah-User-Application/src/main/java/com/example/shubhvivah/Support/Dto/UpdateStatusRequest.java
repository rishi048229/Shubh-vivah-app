package com.example.shubhvivah.Support.Dto;

import com.example.shubhvivah.Support.enums.TicketStatus;

import lombok.Data;

@Data
public class UpdateStatusRequest {
    private TicketStatus status;
}
