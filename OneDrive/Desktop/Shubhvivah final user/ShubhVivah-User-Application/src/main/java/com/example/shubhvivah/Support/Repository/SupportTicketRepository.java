package com.example.shubhvivah.Support.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.shubhvivah.Support.Entity.SupportTicket;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserId(Long userId);
}
