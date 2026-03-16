package com.Shubhvivah.matchmaking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface UserRelationRepository
                extends JpaRepository<UserRelation, Long> {

        /* ================= EXISTS ================= */

        boolean existsByFromUserIdAndToUserIdAndType(
                        Long fromUserId,
                        Long toUserId,
                        RelationType type);

        /* ================= SIMPLE DELETE ================= */

        void deleteByFromUserIdAndToUserIdAndType(
                        Long fromUserId,
                        Long toUserId,
                        RelationType type);

        /* ================= CUSTOM DELETE (SAFE) ================= */

        @Modifying
        @Transactional
        @Query("""
                            DELETE FROM UserRelation r
                            WHERE r.fromUserId = :from
                              AND r.toUserId = :to
                              AND r.type = :type
                        """)
        void deleteBetweenUsers(
                        @Param("from") Long from,
                        @Param("to") Long to,
                        @Param("type") RelationType type);

        /* ================= FETCH ================= */

        List<UserRelation> findByFromUserIdAndType(
                        Long userId,
                        RelationType type);

        @Modifying
        @Transactional
        @Query("""
                            DELETE FROM UserRelation r
                            WHERE r.fromUserId = :userId OR r.toUserId = :userId
                        """)
        void deleteAllByUser(@Param("userId") Long userId);

}
