package com.example.shubhvivah.Support.Controller;

import com.example.shubhvivah.Support.Dto.CreateTicketRequest;
import com.example.shubhvivah.Support.Dto.SupportMessageResponse;
import com.example.shubhvivah.Support.Entity.SupportTicket;
import com.example.shubhvivah.Support.Service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportTicketService ticketService;

    /**
     * POST /support/ticket — Create a new support ticket
     */
    @PostMapping("/ticket")
    public ResponseEntity<SupportTicket> createTicket(
            @RequestBody CreateTicketRequest req,
            Principal principal) {
        Long userId = Long.valueOf(principal.getName());
        SupportTicket ticket = ticketService.createTicket(userId, req);
        return ResponseEntity.ok(ticket);
    }

    /**
     * POST /support/ticket/{ticketId}/reply — Reply to a support ticket
     */
    @PostMapping("/ticket/{ticketId}/reply")
    public ResponseEntity<String> reply(
            @PathVariable Long ticketId,
            @RequestParam(name = "message") String message,
            @RequestParam(name = "files", required = false) List<MultipartFile> files,
            Principal principal) throws Exception {
        Long userId = Long.valueOf(principal.getName());
        ticketService.replyWithAttachments(ticketId, userId, false, message, files);
        return ResponseEntity.ok("Reply sent");
    }

    /**
     * GET /support/ticket/{ticketId}/messages — Get messages for a ticket
     */
    @GetMapping("/ticket/{ticketId}/messages")
    public ResponseEntity<List<SupportMessageResponse>> getMessages(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getMessages(ticketId));
    }
}
