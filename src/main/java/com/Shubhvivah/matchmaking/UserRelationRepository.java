package com.Shubhvivah.matchmaking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRelationRepository
        extends JpaRepository<UserRelation, Long> {

    boolean existsByFromUserIdAndToUserIdAndType(Long from, Long to, RelationType type);

void deleteByFromUserIdAndToUserIdAndType(Long from, Long to, RelationType type);




    List<UserRelation> findByFromUserIdAndType(Long userId, RelationType type);
}
