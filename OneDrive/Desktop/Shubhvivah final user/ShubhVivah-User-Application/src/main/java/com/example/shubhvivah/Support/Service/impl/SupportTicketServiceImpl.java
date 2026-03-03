package com.example.shubhvivah.Support.Service.impl;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;

import com.example.shubhvivah.Support.Dto.CreateTicketRequest;
import com.example.shubhvivah.Support.Dto.SupportMessageResponse;
import com.example.shubhvivah.Support.Entity.SupportTicket;
import com.example.shubhvivah.Support.Entity.SupportTicketMessage;
import com.example.shubhvivah.Support.Entity.SupportAttachment;
import com.example.shubhvivah.Support.enums.TicketStatus;
import com.example.shubhvivah.Support.Service.SupportTicketService;
import com.example.shubhvivah.Support.Service.SupportFileStorageService;
import com.example.shubhvivah.Support.Service.SupportEmailService;
import com.example.shubhvivah.Support.Repository.SupportTicketRepository;
import com.example.shubhvivah.Support.Repository.SupportTicketMessageRepository;
import com.example.shubhvivah.Support.Repository.SupportAttachmentRepository;

@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository ticketRepo;
    private final SupportTicketMessageRepository messageRepo;
    private final SupportAttachmentRepository attachmentRepo;
    private final SupportFileStorageService storageService;
    private final SupportEmailService emailService;

    @Override
    public SupportTicket createTicket(Long userId, CreateTicketRequest req) {

        SupportTicket ticket = ticketRepo.save(SupportTicket.builder()
                .userId(userId)
                .subject(req.getSubject())
                .message(req.getMessage())
                .priority(req.getPriority())
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build());

        messageRepo.save(SupportTicketMessage.builder()
                .ticketId(ticket.getId())
                .senderId(userId)
                .adminMessage(false)
                .message(req.getMessage())
                .sentAt(LocalDateTime.now())
                .build());

        emailService.notifyAdminNewTicket(ticket);
        return ticket;
    }

    @Override
    public void replyWithAttachments(Long ticketId,
            Long senderId,
            boolean admin,
            String msg,
            List<MultipartFile> files) throws Exception {

        SupportTicket ticket = ticketRepo.findById(ticketId).orElseThrow();

        SupportTicketMessage message = messageRepo.save(
                SupportTicketMessage.builder()
                        .ticketId(ticketId)
                        .senderId(senderId)
                        .adminMessage(admin)
                        .message(msg)
                        .sentAt(LocalDateTime.now())
                        .build());

        if (files != null) {
            for (MultipartFile file : files) {

                String url = storageService.store(file);

                attachmentRepo.save(SupportAttachment.builder()
                        .ticketId(ticketId)
                        .messageId(message.getId())
                        .fileName(file.getOriginalFilename())
                        .fileUrl(url)
                        .fileType(file.getContentType().startsWith("image") ? "IMAGE" : "FILE")
                        .build());
            }
        }

        if (admin)
            emailService.notifyUserReply(ticket, msg);
    }

    @Override
    public List<SupportMessageResponse> getMessages(Long ticketId) {

        List<SupportTicketMessage> messages = messageRepo.findByTicketIdOrderBySentAtAsc(ticketId);

        return messages.stream().map(msg -> new SupportMessageResponse(msg,
                attachmentRepo.findByMessageId(msg.getId()))).toList();
    }
}