package com.example.shubhvivah.Support.Service;

import com.example.shubhvivah.Support.Dto.CreateTicketRequest;
import com.example.shubhvivah.Support.Dto.SupportMessageResponse;
import com.example.shubhvivah.Support.Entity.SupportTicket;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SupportTicketService {

    SupportTicket createTicket(Long userId, CreateTicketRequest req);

    void replyWithAttachments(Long ticketId,
            Long senderId,
            boolean admin,
            String msg,
            List<MultipartFile> files) throws Exception;

    List<SupportMessageResponse> getMessages(Long ticketId);
}