package com.Shubhvivah.horoscope;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Shubhvivah.auth.UserEntity;
import com.Shubhvivah.auth.UserRepository;
import com.Shubhvivah.profile.ProfileEntity;
import com.Shubhvivah.profile.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HoroscopeService {

    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final RestTemplate restTemplate;

    public HoroscopeDto getTodayHoroscope(Long userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        ProfileEntity profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        if (profile.getRashi() == null) {
            throw new IllegalStateException("Rashi not set in profile");
        }

        String rashi = profile.getRashi().toLowerCase();

        String url =
            "https://api.aztro.sameerkumar.website/"
            + "?sign=" + rashi
            + "&day=today";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST, // Aztro REQUIRES POST
                        request,
                        Map.class
                );

        Map body = response.getBody();

        HoroscopeDto dto = new HoroscopeDto();
        dto.setRashi(profile.getRashi());
        dto.setDate(LocalDate.now());
        dto.setPrediction((String) body.get("description"));
        dto.setMood((String) body.get("mood"));
        dto.setLuckyColor((String) body.get("color"));
        dto.setLuckyNumber((String) body.get("lucky_number"));

        return dto;
    }
}
