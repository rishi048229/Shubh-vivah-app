package com.Shubhvivah.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // FULL CONVERSATION (both directions in single query)
    List<ChatMessage> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
            Long sender1, Long receiver1,
            Long sender2, Long receiver2);

    // LAST MESSAGE (for chat list)
    ChatMessage findTopBySenderIdOrReceiverIdOrderBySentAtDesc(Long senderId, Long receiverId);

    @Modifying
    @Transactional
    @Query("""
                DELETE FROM ChatMessage m
                WHERE m.senderId = :userId OR m.receiverId = :userId
            """)
    void deleteAllByUser(@Param("userId") Long userId);

}
