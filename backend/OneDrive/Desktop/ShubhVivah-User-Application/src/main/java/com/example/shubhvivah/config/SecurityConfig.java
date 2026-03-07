package com.example.shubhvivah.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {

                http
                                // Enable CORS using the CorsConfigurationSource bean
                                .cors(org.springframework.security.config.Customizer.withDefaults())

                                // Disable CSRF for REST APIs
                                .csrf(csrf -> csrf.disable())

                                // Add JWT filter before UsernamePasswordAuthenticationFilter
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                                // Authorization rules
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/auth/register",
                                                                "/auth/login",
                                                                "/auth/**",
                                                                "/otp/**",
                                                                "/api/master/**",
                                                                "/ws-chat/**",
                                                                "/error")
                                                .permitAll()
                                                .anyRequest().authenticated())

                                // Disable default login form
                                .formLogin(form -> form.disable())

                                // Disable HTTP Basic popup
                                .httpBasic(basic -> basic.disable());

                return http.build();
        }
}
