package com.example.shubhvivah.Chat.Controller;

import com.example.shubhvivah.Chat.Entity.ChatMessage;
import com.example.shubhvivah.Chat.Presence.OnlineUsers;
import com.example.shubhvivah.Chat.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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
            @RequestParam(name = "otherUserId") Long otherUserId) {

        Long currentUserId = getCurrentUserId();
        return chatService.getChat(currentUserId, otherUserId);
    }

    /* ================= ONLINE STATUS ================= */
    @GetMapping("/online/{userId}")
    public Map<String, Object> isUserOnline(@PathVariable Long userId) {
        return Map.of(
            "userId", userId,
            "online", OnlineUsers.isOnline(userId)
        );
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