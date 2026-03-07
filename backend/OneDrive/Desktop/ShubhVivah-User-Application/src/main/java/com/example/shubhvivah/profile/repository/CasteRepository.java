package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.Caste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface CasteRepository extends JpaRepository<Caste, Long> {

    List<Caste> findByCommunityIdAndActiveTrue(Long communityId);

    Optional<Caste> findByCasteNameIgnoreCase(String casteName);
}
