package com.example.shubhvivah.config;

import com.example.shubhvivah.Chat.Presence.OnlineUsers;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Listens for WebSocket session disconnect events to reliably
 * mark users as offline — even if STOMP DISCONNECT frame is never sent
 * (e.g. network drops, app killed, etc.)
 */
@Component
public class WebSocketEventListener {

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (accessor.getUser() != null) {
            try {
                Long userId = Long.valueOf(accessor.getUser().getName());
                OnlineUsers.userOffline(userId);
                System.out.println("[WS-EVENT] User " + userId + " session closed - marked OFFLINE");
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }
    }
}
