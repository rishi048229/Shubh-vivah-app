package com.Shubhvivah.support;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository ticketRepo;
    private final SupportTicketMessageRepository messageRepo;
    private final SupportAttachmentRepository attachmentRepo;
    private final SupportFileStorageService storageService;
    private final SupportEmailService emailService;

    /* CREATE TICKET */

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

    /* REPLY WITH FILES */

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

        if (admin) emailService.notifyUserReply(ticket, msg);
    }

    /* GET MESSAGES */

    public List<SupportMessageResponse> getMessages(Long ticketId) {

        List<SupportTicketMessage> messages =
                messageRepo.findByTicketIdOrderBySentAtAsc(ticketId);

        return messages.stream().map(msg ->
                new SupportMessageResponse(msg,
                        attachmentRepo.findByMessageId(msg.getId()))
        ).toList();
    }
}
