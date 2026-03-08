package com.example.shubhvivah.profile.service;

import com.example.shubhvivah.profile.dto.ResponseDto.MasterOptionResponseDto;
import com.example.shubhvivah.profile.repository.CasteRepository;
import com.example.shubhvivah.profile.repository.CommunityRepository;
import com.example.shubhvivah.profile.repository.GotraRepository;
import com.example.shubhvivah.profile.repository.ReligionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterDataService {

        private final ReligionRepository religionRepository;
        private final CommunityRepository communityRepository;
        private final CasteRepository casteRepository;
        private final GotraRepository gotraRepository;

        public List<MasterOptionResponseDto> getReligions() {
            return religionRepository.findByActiveTrue()
                    .stream()
                    .map(r -> new MasterOptionResponseDto(r.getId(), r.getReligionName()))
                    .toList();
        }

        public List<MasterOptionResponseDto> getCommunities(Long religionId) {
            return communityRepository.findByReligionIdAndActiveTrue(religionId)
                    .stream()
                    .map(c -> new MasterOptionResponseDto(c.getId(), c.getCommunityName()))
                    .toList();
        }

        public List<MasterOptionResponseDto> getCastes(Long communityId) {
            return casteRepository.findByCommunityIdAndActiveTrue(communityId)
                    .stream()
                    .map(c -> new MasterOptionResponseDto(c.getId(), c.getCasteName()))
                    .toList();
        }

        public List<MasterOptionResponseDto> getGotras(Long casteId) {
            return gotraRepository.findByCasteIdAndActiveTrue(casteId)
                    .stream()
                    .map(g -> new MasterOptionResponseDto(g.getId(), g.getGotraName()))
                    .toList();
        }

}
