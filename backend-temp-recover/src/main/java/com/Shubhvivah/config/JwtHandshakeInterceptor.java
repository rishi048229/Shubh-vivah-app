package com.Shubhvivah.config;

import com.Shubhvivah.common.Util;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.*;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   org.springframework.web.socket.WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        try {
            if (request instanceof ServletServerHttpRequest servletRequest) {

                HttpServletRequest req = servletRequest.getServletRequest();
                String token = req.getParameter("token");

                if (token != null && !token.isBlank() && Util.isTokenValid(token)) {

                    Long userId = Util.extractUserId(token);
                    attributes.put("userId", userId);

                    System.out.println("WebSocket authenticated userId=" + userId);
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("WebSocket authentication FAILED");
        return false;   // 🔒 STRICT MODE
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               org.springframework.web.socket.WebSocketHandler wsHandler,
                               Exception exception) {
    }
}
