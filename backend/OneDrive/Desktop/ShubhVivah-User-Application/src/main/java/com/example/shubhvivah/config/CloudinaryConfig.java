package com.example.shubhvivah.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhn9yyv72",
                "api_key", "426564232229413",
                "api_secret", "eGtWYWjHAGJoBjLGg-2SGT1w5Xo",
                "secure", true));
    }
}