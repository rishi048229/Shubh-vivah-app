package com.example.shubhvivah.Chat.Presence;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.RequiredArgsConstructor;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PresenceListener {

    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        Long userId = extractUserId(event);
        if (userId != null) {
            OnlineUsers.userOnline(userId);
            System.out.println("User ONLINE: " + userId);
            
            // Broadcast real-time presence
            messagingTemplate.convertAndSend("/topic/presence", Map.of(
                "userId", userId,
                "status", "ONLINE"
            ));
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        Long userId = extractUserId(event);
        if (userId != null) {
            OnlineUsers.userOffline(userId);
            System.out.println("User OFFLINE: " + userId);

            // Broadcast real-time presence
            messagingTemplate.convertAndSend("/topic/presence", Map.of(
                "userId", userId,
                "status", "OFFLINE"
            ));
        }
    }

    private Long extractUserId(Object event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(
                event instanceof SessionConnectedEvent
                        ? ((SessionConnectedEvent) event).getMessage()
                        : ((SessionDisconnectEvent) event).getMessage());

        if (accessor.getUser() == null)
            return null;

        try {
            return Long.valueOf(accessor.getUser().getName());
        } catch (Exception e) {
            return null;
        }
    }
}
