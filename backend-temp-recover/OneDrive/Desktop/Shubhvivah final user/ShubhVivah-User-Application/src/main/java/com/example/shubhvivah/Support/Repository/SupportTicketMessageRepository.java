package com.example.shubhvivah.Support.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.shubhvivah.Support.Entity.SupportTicketMessage;

public interface SupportTicketMessageRepository
        extends JpaRepository<SupportTicketMessage, Long> {

    // Get all messages of a ticket in chronological order
    List<SupportTicketMessage> findByTicketIdOrderBySentAtAsc(Long ticketId);
}
