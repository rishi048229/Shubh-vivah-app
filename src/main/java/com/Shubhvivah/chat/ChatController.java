package com.Shubhvivah.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository repo;

    /* ================= CHAT HISTORY ================= */
    @GetMapping("/history")
    public List<ChatMessage> history(
            @RequestParam Long u1,
            @RequestParam Long u2) {

        // Single query fetch (both directions sorted)
        return repo.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
                u1, u2,
                u2, u1
        );
    }
}
