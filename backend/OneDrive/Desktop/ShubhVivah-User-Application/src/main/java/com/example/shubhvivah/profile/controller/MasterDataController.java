package com.example.shubhvivah.profile.controller;

import com.example.shubhvivah.profile.dto.ResponseDto.MasterOptionResponseDto;
import com.example.shubhvivah.profile.service.MasterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
public class MasterDataController {

    private final MasterDataService service;

    @GetMapping("/religions")
    public ResponseEntity<List<MasterOptionResponseDto>> getReligions() {
        return ResponseEntity.ok(service.getReligions());
    }

    @GetMapping("/communities")
    public ResponseEntity<List<MasterOptionResponseDto>> getCommunities(@RequestParam Long religionId) {
        return ResponseEntity.ok(service.getCommunities(religionId));
    }

    @GetMapping("/castes")
    public ResponseEntity<List<MasterOptionResponseDto>> getCastes(@RequestParam Long communityId) {
        return ResponseEntity.ok(service.getCastes(communityId));
    }

    @GetMapping("/gotras")
    public ResponseEntity<List<MasterOptionResponseDto>> getGotras(@RequestParam Long casteId) {
        return ResponseEntity.ok(service.getGotras(casteId));
    }
}
