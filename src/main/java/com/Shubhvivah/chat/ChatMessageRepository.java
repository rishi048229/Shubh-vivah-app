package com.Shubhvivah.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // FULL CONVERSATION (both directions in single query)
    List<ChatMessage> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
            Long sender1, Long receiver1,
            Long sender2, Long receiver2
    );

    // LAST MESSAGE (for chat list)
    ChatMessage findTopBySenderIdOrReceiverIdOrderBySentAtDesc(Long senderId, Long receiverId);
}
