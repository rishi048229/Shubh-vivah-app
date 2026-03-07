package com.example.shubhvivah.profile.repository;

import com.example.shubhvivah.profile.entity.Gotra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GotraRepository extends JpaRepository<Gotra, Long> {

    List<Gotra> findByCasteIdAndActiveTrue(Long casteId);
}
