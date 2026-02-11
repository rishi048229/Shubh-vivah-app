package com.Shubhvivah.chat;
import org.springframework.security.core.context.SecurityContextHolder;

import com.Shubhvivah.matchmaking.RelationType;
import com.Shubhvivah.matchmaking.UserRelationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;   // ✅ ADDED (required)
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repo;
    private final UserRelationRepository relationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /* =====================================================
       SEND MESSAGE
     ===================================================== */

     public void sendMessage(ChatMessage msg) {

        /* ===== AUTH USER CHECK (ANTI-SPOOF) ===== */
        Long authUserId = Long.valueOf(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
    
        if (!authUserId.equals(msg.getSenderId())) {
            throw new RuntimeException("Invalid sender. Unauthorized message attempt.");
        }
    
        /* ===== BLOCK MEDIA ===== */
        if (msg.getType() != null &&
                (msg.getType().equalsIgnoreCase("IMAGE") ||
                 msg.getType().equalsIgnoreCase("VIDEO"))) {
    
            throw new RuntimeException("Photos and videos are not allowed in chat.");
        }
    
        /* ===== MATCH CHECK ===== */
        boolean matched =
                relationRepository.existsByFromUserIdAndToUserIdAndType(
                        msg.getSenderId(),
                        msg.getReceiverId(),
                        RelationType.MATCH
                )
                &&
                relationRepository.existsByFromUserIdAndToUserIdAndType(
                        msg.getReceiverId(),
                        msg.getSenderId(),
                        RelationType.MATCH
                );
    
        if (!matched) {
            throw new RuntimeException("Users are not matched. Messaging not allowed.");
        }
    
        /* ===== BLOCK CHECK ===== */
        boolean blocked =
                relationRepository.existsByFromUserIdAndToUserIdAndType(
                        msg.getSenderId(),
                        msg.getReceiverId(),
                        RelationType.BLOCK
                )
                ||
                relationRepository.existsByFromUserIdAndToUserIdAndType(
                        msg.getReceiverId(),
                        msg.getSenderId(),
                        RelationType.BLOCK
                );
    
        if (blocked) {
            throw new RuntimeException("Messaging blocked between users.");
        }
    
        /* ===== SANITIZE MESSAGE ===== */
        msg.setContent(sanitizeMessage(msg.getContent()));
    
        /* ===== DELIVERY STATUS ===== */
        msg.setDelivered(OnlineUsers.isOnline(msg.getReceiverId()));
    
        /* ===== SAVE ===== */
        repo.save(msg);
    
        /* ===== REALTIME SEND ===== */
        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg
        );
    }
    

    /* =====================================================
       GET CHAT BETWEEN TWO USERS
     ===================================================== */

    public List<ChatMessage> getChat(Long user1, Long user2) {
        return repo.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
                user1, user2, user2, user1
        );
    }

    /* =====================================================
MARK SEEN
     ===================================================== */

    public void markSeen(Long msgId, Long userId) {
        ChatMessage msg = repo.findById(msgId).orElseThrow();
        msg.setSeen(true);
        msg.setSeenAt(LocalDateTime.now());
        repo.save(msg);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg
        );
    }

    /* =====================================================
       DELETE MESSAGE
     ===================================================== */

    public void deleteMessage(Long id) {
        ChatMessage msg = repo.findById(id).orElseThrow();
        msg.setDeleted(true);
        repo.save(msg);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg
        );
    }

    /* =====================================================
       EDIT MESSAGE
     ===================================================== */

    

    /* =====================================================
       MESSAGE SANITIZER
     ===================================================== */

    private String sanitizeMessage(String msg) {

        if (msg == null) return null;

        String text = msg.toLowerCase();

        if (text.matches(".*\\d{5,}.*")) return "XXXXXXXXX";
        if (text.matches(".*(\\d\\s*){5,}.*")) return "XXXXXXXXX";

        String[] words = {
                "zero","one","two","three","four",
                "five","six","seven","eight","nine"
        };

        int count = 0;
        for (String w : words) {
            if (text.contains(w)) count++;
        }
        if (count >= 3) return "XXXXXXXXX";

        if (text.contains("instagram") ||
            text.contains("insta") ||
            text.contains("telegram") ||
            text.contains("tg") ||
            text.contains("whatsapp") ||
            text.contains("wa.me") ||
            text.contains("@")) {
            return "XXXXXXXXX";
        }

        return msg;
    }

    /* =====================================================
       CHAT KEY (PAIR BASED)
     ===================================================== */

    private String getChatKey(Long u1, Long u2) {
        Long min = Math.min(u1, u2);
        Long max = Math.max(u1, u2);
        return min + "_" + max;
    }
    public void editMessage(Long id, String text) {
        ChatMessage msg = repo.findById(id).orElseThrow();
    
        if (msg.isDeleted()) return;   // 🚫 prevent editing deleted message
    
        msg.setContent(text);
        repo.save(msg);
    
        messagingTemplate.convertAndSend(
            "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
            msg
        );
    }
    
}
