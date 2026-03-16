package com.Shubhvivah.support;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketMessageRepository
        extends JpaRepository<SupportTicketMessage, Long> {

    // Get all messages of a ticket in chronological order
    List<SupportTicketMessage> findByTicketIdOrderBySentAtAsc(Long ticketId);
}
