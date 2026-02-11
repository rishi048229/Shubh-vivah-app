package com.Shubhvivah.chat;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class PresenceListener {

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        Long userId = extractUserId(event);
        if (userId != null) {
            OnlineUsers.userOnline(userId);   // ✅ your method
            System.out.println("User ONLINE: " + userId);
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        Long userId = extractUserId(event);
        if (userId != null) {
            OnlineUsers.userOffline(userId);  // ✅ your method
            System.out.println("User OFFLINE: " + userId);
        }
    }

    private Long extractUserId(Object event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(
                event instanceof SessionConnectedEvent
                        ? ((SessionConnectedEvent) event).getMessage()
                        : ((SessionDisconnectEvent) event).getMessage()
        );

        if (accessor.getUser() == null) return null;

        try {
            return Long.valueOf(accessor.getUser().getName());
        } catch (Exception e) {
            return null;
        }
    }
}
