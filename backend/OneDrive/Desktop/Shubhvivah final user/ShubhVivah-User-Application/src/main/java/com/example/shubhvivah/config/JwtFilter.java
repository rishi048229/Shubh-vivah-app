package com.example.shubhvivah.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");
                String token = null;

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        token = authHeader.substring(7);
                } else {
                        // Check for token in query parameter (useful for WebSocket handshake)
                        token = request.getParameter("token");
                }

                if (token != null) {
                        if (jwtUtil.isTokenValid(token)) {
                                Long userId = jwtUtil.extractUserId(token);

                                // Create Spring Security authentication
                                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                userId,
                                                null,
                                                Collections.emptyList());

                                authentication.setDetails(
                                                new WebAuthenticationDetailsSource().buildDetails(request));

                                // Set authentication in security context
                                SecurityContextHolder.getContext()
                                                .setAuthentication(authentication);

                                // Also set as request attribute for backward compatibility
                                request.setAttribute("userId", userId);
                        }
                }

                filterChain.doFilter(request, response);
        }
}
