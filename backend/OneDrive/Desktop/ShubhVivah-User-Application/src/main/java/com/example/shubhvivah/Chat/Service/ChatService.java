package com.example.shubhvivah.Chat.Service;

import com.example.shubhvivah.Chat.Entity.ChatMessage;
import com.example.shubhvivah.Chat.Repository.ChatMessageRepository;
import com.example.shubhvivah.Chat.Presence.OnlineUsers;
import com.example.shubhvivah.Matchmaking.Repository.UserRelationRepository;
import com.example.shubhvivah.Matchmaking.enums.RelationType;
import com.example.shubhvivah.Vendor.Repository.ServiceRequestRepository;
import com.example.shubhvivah.Vendor.Entity.ServiceRequest;
import com.example.shubhvivah.Vendor.Enums.RequestStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repo;
    private final UserRelationRepository relationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ServiceRequestRepository serviceRequestRepository;

    /*
     * =====================================================
     * SEND MESSAGE
     * =====================================================
     */

    public void sendMessage(ChatMessage msg) {

        /* Note: Auth check is handled by ChatSocketController using STOMP Principal */

        /* ===== BLOCK MEDIA ===== */
        if (msg.getType() != null &&
                (msg.getType().equalsIgnoreCase("IMAGE")
                        || msg.getType().equalsIgnoreCase("VIDEO"))) {
            throw new RuntimeException("Photos and videos are not allowed in chat.");
        }

        /*
         * =====================================================
         * CHECK IF THIS IS USER ↔ VENDOR CHAT
         * =====================================================
         */

        boolean isVendorChat = serviceRequestRepository.existsByUserIdAndVendorId(
                msg.getSenderId(), msg.getReceiverId())
                ||
                serviceRequestRepository.existsByUserIdAndVendorId(
                        msg.getReceiverId(), msg.getSenderId());

        if (isVendorChat) {

            ServiceRequest request = serviceRequestRepository
                    .findTopByUserIdAndVendorIdOrderByCreatedAtDesc(
                            msg.getSenderId(),
                            msg.getReceiverId())
                    .or(() -> serviceRequestRepository
                            .findTopByVendorIdAndUserIdOrderByCreatedAtDesc(
                                    msg.getSenderId(),
                                    msg.getReceiverId()))
                    .orElseThrow(() -> new RuntimeException("No service request found"));

            // vendor chat locking
            if (request.getStatus() != RequestStatus.ACCEPTED) {
                msg.setVisibleToVendor(false);
            } else {
                msg.setVisibleToVendor(true);
            }

        } else {

            // ✅ ONLY NORMAL USER CHAT NEEDS MATCH
            boolean matched = relationRepository.existsByFromUserIdAndToUserIdAndType(
                    msg.getSenderId(),
                    msg.getReceiverId(),
                    RelationType.MATCH)
                    &&
                    relationRepository.existsByFromUserIdAndToUserIdAndType(
                            msg.getReceiverId(),
                            msg.getSenderId(),
                            RelationType.MATCH);

            if (!matched) {
                throw new RuntimeException("Users are not matched. Messaging not allowed.");
            }

            msg.setVisibleToVendor(true);
        }

        /* ===== BLOCK CHECK ===== */

        boolean blocked = relationRepository.existsByFromUserIdAndToUserIdAndType(
                msg.getSenderId(),
                msg.getReceiverId(),
                RelationType.BLOCK)
                ||
                relationRepository.existsByFromUserIdAndToUserIdAndType(
                        msg.getReceiverId(),
                        msg.getSenderId(),
                        RelationType.BLOCK);

        if (blocked) {
            throw new RuntimeException("Messaging blocked between users.");
        }

        /* ===== SANITIZE MESSAGE ===== */
        msg.setContent(sanitizeMessage(msg.getContent()));

        /* ===== DELIVERY STATUS ===== */
        msg.setDelivered(OnlineUsers.isOnline(msg.getReceiverId()));

        /* ===== SAVE MESSAGE ===== */
        repo.save(msg);

        /* ===== REALTIME SEND ===== */
        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg);

        /* ===== NOTIFICATION ===== */
        try {
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + msg.getReceiverId(),
                    java.util.Map.of(
                            "type", "NEW_MESSAGE",
                            "senderId", msg.getSenderId(),
                            "content", msg.getContent(),
                            "timestamp", java.time.LocalDateTime.now().toString()));
        } catch (Exception e) {
            System.err.println("Failed to send chat notification: " + e.getMessage());
        }
    }

    /*
     * =====================================================
     * GET CHAT BETWEEN TWO USERS
     * =====================================================
     */

    public List<ChatMessage> getChat(Long user1, Long user2) {

        Long viewerId = Long.valueOf(
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName());

        return repo.findConversation(
                user1,
                user2,
                user2,
                user1,
                viewerId);
    }

    /*
     * =====================================================
     * MARK MESSAGE SEEN
     * =====================================================
     */

    public void markSeen(Long msgId, Long userId) {

        ChatMessage msg = repo.findById(msgId).orElseThrow();

        msg.setSeen(true);
        msg.setSeenAt(LocalDateTime.now());

        repo.save(msg);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg);
    }

    /*
     * =====================================================
     * DELETE MESSAGE
     * =====================================================
     */

    public void deleteMessage(Long id) {

        ChatMessage msg = repo.findById(id).orElseThrow();

        msg.setDeleted(true);

        repo.save(msg);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg);
    }

    /*
     * =====================================================
     * EDIT MESSAGE
     * =====================================================
     */

    public void editMessage(Long id, String text) {

        ChatMessage msg = repo.findById(id).orElseThrow();

        if (msg.isDeleted())
            return;

        msg.setContent(text);

        repo.save(msg);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + getChatKey(msg.getSenderId(), msg.getReceiverId()),
                msg);
    }

    /*
     * =====================================================
     * MESSAGE SANITIZER
     * =====================================================
     */

    private String sanitizeMessage(String msg) {

        if (msg == null)
            return null;

        String text = msg.toLowerCase();

        if (text.matches(".*\\d{5,}.*"))
            return "XXXXXXXXX";

        if (text.matches(".*(\\d\\s*){5,}.*"))
            return "XXXXXXXXX";

        String[] words = {
                "zero", "one", "two", "three", "four",
                "five", "six", "seven", "eight", "nine"
        };

        int count = 0;
        for (String w : words) {
            if (text.contains(w))
                count++;
        }

        if (count >= 3)
            return "XXXXXXXXX";

        if (text.contains("instagram")
                || text.contains("insta")
                || text.contains("telegram")
                || text.contains("tg")
                || text.contains("whatsapp")
                || text.contains("wa.me")
                || text.contains("@")) {
            return "XXXXXXXXX";
        }

        return msg;
    }

    /*
     * =====================================================
     * CHAT KEY (PAIR BASED)
     * =====================================================
     */

    private String getChatKey(Long u1, Long u2) {
        Long min = Math.min(u1, u2);
        Long max = Math.max(u1, u2);
        return min + "_" + max;
    }
}