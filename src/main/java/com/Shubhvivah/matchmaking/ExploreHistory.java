package com.Shubhvivah.matchmaking;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "explore_history")
public class ExploreHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long viewedUserId;

    private LocalDateTime viewedAt = LocalDateTime.now();
}
