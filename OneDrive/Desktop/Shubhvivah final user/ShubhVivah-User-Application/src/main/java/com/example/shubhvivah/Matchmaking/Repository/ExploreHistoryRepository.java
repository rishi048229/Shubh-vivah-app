package com.example.shubhvivah.Matchmaking.Repository;

import com.example.shubhvivah.Matchmaking.Entity.ExploreHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExploreHistoryRepository
        extends JpaRepository<ExploreHistory, Long> {

    List<ExploreHistory> findByUserIdOrderByViewedAtDesc(Long userId);

    void deleteByUserId(Long userId); // ✅ ADD THIS
}
