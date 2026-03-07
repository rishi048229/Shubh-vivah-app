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
                "cloud_name", "dn0yvyhzf",
                "api_key", "591992388155541",
                "api_secret", "BHDuFHBoEXBBDNW24drhYjlkiTw",
                "secure", true));
    }
}