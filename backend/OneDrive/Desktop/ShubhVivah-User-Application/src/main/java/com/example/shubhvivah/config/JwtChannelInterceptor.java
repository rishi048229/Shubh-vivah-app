package com.example.shubhvivah.config;

import com.example.shubhvivah.Chat.Presence.OnlineUsers;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import java.util.Collections;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // First try to extract token from STOMP headers
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            String token = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            } else {
                // If not in headers, check session attributes populated by
                // JwtHandshakeInterceptor
                Object tokenObj = accessor.getSessionAttributes() != null
                    ? accessor.getSessionAttributes().get("token") : null;
                if (tokenObj != null) {
                    token = tokenObj.toString();
                }
            }

            if (token != null && jwtUtil.isTokenValid(token)) {
                Long userId = jwtUtil.extractUserId(token);
                // Create minimal authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, Collections.emptyList());
                accessor.setUser(authentication);

                // Mark user as ONLINE
                OnlineUsers.userOnline(userId);
                System.out.println("[WS] User " + userId + " connected - marked ONLINE");
            }
        }

        if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            // Mark user as OFFLINE on disconnect
            if (accessor.getUser() != null) {
                try {
                    Long userId = Long.valueOf(accessor.getUser().getName());
                    OnlineUsers.userOffline(userId);
                    System.out.println("[WS] User " + userId + " disconnected - marked OFFLINE");
                } catch (Exception e) {
                    // Ignore parsing errors
                }
            }
        }

        return message;
    }
}
