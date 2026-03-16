package com.Shubhvivah.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatService service;
    private final SimpMessagingTemplate messagingTemplate;   // ✅ ADDED

    /* ================= SEND MESSAGE ================= */

    @MessageMapping("/chat.send")
    public void send(ChatMessage msg) {
        service.sendMessage(msg);
    }

    /* ================= MARK SEEN ================= */

    @MessageMapping("/chat.seen")
    public void markSeen(SeenRequest req) {
        service.markSeen(req.getMessageId(), req.getUserId());
    }

    /* ================= TYPING INDICATOR ================= */

    @MessageMapping("/chat.typing")
    public void typing(TypingRequest req) {
        messagingTemplate.convertAndSend(
                "/topic/typing/" + getChatKey(req.getFrom(), req.getTo()),
                req
        );
    }

    /* ================= DELETE MESSAGE ================= */

    @MessageMapping("/chat.delete")
    public void delete(Long msgId) {
        service.deleteMessage(msgId);
    }

    /* ================= CHAT KEY ================= */

    private String getChatKey(Long u1, Long u2) {
        Long min = Math.min(u1, u2);
        Long max = Math.max(u1, u2);
        return min + "_" + max;
    }
    @MessageMapping("/chat.edit")
    public void edit(EditRequest req) {
        service.editMessage(req.getId(), req.getText());
    }
    
    
}

