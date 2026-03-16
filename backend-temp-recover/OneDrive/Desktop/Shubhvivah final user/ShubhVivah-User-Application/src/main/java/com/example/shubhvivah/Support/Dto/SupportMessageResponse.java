package com.example.shubhvivah.Support.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import com.example.shubhvivah.Support.Entity.SupportTicketMessage;
import com.example.shubhvivah.Support.Entity.SupportAttachment;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportMessageResponse {
    private SupportTicketMessage message;
    private List<SupportAttachment> attachments;
}
