package com.Shubhvivah.support;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService service;

    @PostMapping
    public SupportTicket create(@RequestBody CreateTicketRequest req) {
        return service.createTicket(getUserId(), req);
    }

    @PostMapping(value = "/{ticketId}/reply", consumes = "multipart/form-data")
    public void reply(
            @PathVariable Long ticketId,
            @RequestParam String message,
            @RequestParam(required = false) List<MultipartFile> files) throws Exception {

        service.replyWithAttachments(ticketId, getUserId(), false, message, files);
    }

    @GetMapping("/{ticketId}/messages")
    public List<SupportMessageResponse> messages(@PathVariable Long ticketId) {
        return service.getMessages(ticketId);
    }

    private Long getUserId() {
        return 1L; // replace with JWT auth
    }
}
