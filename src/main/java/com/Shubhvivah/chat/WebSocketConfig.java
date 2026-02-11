package com.Shubhvivah.chat;

import com.Shubhvivah.config.JwtHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // Broker for outgoing messages (server → clients)
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for incoming messages (client → server)
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        /*
         * RAW WebSocket endpoint (for Postman / direct ws:// testing)
         * ws://localhost:8080/ws-chat/websocket?token=JWT
         */
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
                .addInterceptors(new JwtHandshakeInterceptor());

        /*
         * SockJS endpoint (for Browser / Frontend)
         * http://localhost:8080/ws-chat?token=JWT
         */
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
                .addInterceptors(new JwtHandshakeInterceptor())
                .withSockJS();
    }
}
