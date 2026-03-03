package com.example.shubhvivah.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

        /*
         * =============================
         * MESSAGE BROKER
         * =============================
         */
        @Override
        public void configureMessageBroker(MessageBrokerRegistry registry) {

                // client → server
                registry.setApplicationDestinationPrefixes("/app");

                // server → client
                registry.enableSimpleBroker("/topic", "/queue");
        }

        /*
         * =============================
         * WEBSOCKET ENDPOINT
         * =============================
         */
        @Override
        public void registerStompEndpoints(StompEndpointRegistry registry) {

                registry.addEndpoint("/ws-chat")
                                .setAllowedOriginPatterns("*") // ⭐ allow local testing
                                .addInterceptors(new JwtHandshakeInterceptor())
                                .withSockJS(); // ⭐ required for browser test
        }
}