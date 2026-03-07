package com.example.shubhvivah.Chat.Controller;

import com.example.shubhvivah.Chat.Entity.ChatMessage;
import com.example.shubhvivah.Chat.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /* ================= CHAT HISTORY ================= */
    @GetMapping("/history")
    public List<ChatMessage> history(
            @RequestParam Long otherUserId) {

        Long currentUserId = getCurrentUserId();
        return chatService.getChat(currentUserId, otherUserId);
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        }
        throw new IllegalStateException("Invalid authentication principal");
    }
}