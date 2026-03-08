package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    List<Community> findByReligionIdAndActiveTrue(Long religionId);

    Optional<Community> findByCommunityNameIgnoreCase(String communityName);
}
