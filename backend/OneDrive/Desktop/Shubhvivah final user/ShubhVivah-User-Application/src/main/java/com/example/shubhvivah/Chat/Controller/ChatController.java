package com.example.shubhvivah.Chat.Controller;

import com.example.shubhvivah.Chat.Entity.ChatMessage;
import com.example.shubhvivah.Chat.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /* ================= CHAT HISTORY ================= */
    @GetMapping("/history")
    public List<ChatMessage> history(
            @RequestParam Long otherUserId,
            Principal principal) {

        Long currentUserId = Long.valueOf(principal.getName());

        return chatService.getChat(currentUserId, otherUserId);
    }
}