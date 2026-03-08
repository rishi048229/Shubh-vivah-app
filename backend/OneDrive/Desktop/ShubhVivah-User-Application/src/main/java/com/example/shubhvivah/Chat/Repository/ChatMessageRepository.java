package com.example.shubhvivah.Chat.Repository;

import com.example.shubhvivah.Chat.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

        // =====================================================
        // FULL CONVERSATION (WITH VISIBILITY FILTER)
        // =====================================================
        @Query("SELECT m FROM ChatMessage m " +
                        "WHERE (" +
                        " (m.senderId = :sender1 AND m.receiverId = :receiver1) " +
                        " OR (m.senderId = :sender2 AND m.receiverId = :receiver2)" +
                        ") " +
                        "AND (" +
                        " m.visibleToVendor = true " +
                        " OR m.senderId = :viewerId" +
                        ") " +
                        "ORDER BY m.sentAt ASC")
        List<ChatMessage> findConversation(
                        @Param("sender1") Long sender1,
                        @Param("receiver1") Long receiver1,
                        @Param("sender2") Long sender2,
                        @Param("receiver2") Long receiver2,
                        @Param("viewerId") Long viewerId);

        // =====================================================
        // LAST MESSAGE
        // =====================================================
        ChatMessage findTopBySenderIdOrReceiverIdOrderBySentAtDesc(
                        Long senderId,
                        Long receiverId);

        // =====================================================
        // DELETE ALL MESSAGES OF USER
        // =====================================================
        @Modifying
        @Transactional
        @Query("DELETE FROM ChatMessage m " +
                        "WHERE m.senderId = :userId " +
                        "OR m.receiverId = :userId")
        void deleteAllByUser(@Param("userId") Long userId);

        // =====================================================
        // UNLOCK OLD MESSAGES WHEN VENDOR ACCEPTS
        // =====================================================
        @Modifying
        @Transactional
        @Query("UPDATE ChatMessage m SET m.visibleToVendor = true " +
                        "WHERE (" +
                        " (m.senderId = :u1 AND m.receiverId = :u2) " +
                        " OR (m.senderId = :u2 AND m.receiverId = :u1)" +
                        ")")
        void unlockMessages(
                        @Param("u1") Long u1,
                        @Param("u2") Long u2);
}