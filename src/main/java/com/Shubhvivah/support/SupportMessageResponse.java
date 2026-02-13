package com.Shubhvivah.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportMessageResponse {
    private SupportTicketMessage message;
    private List<SupportAttachment> attachments;
}
