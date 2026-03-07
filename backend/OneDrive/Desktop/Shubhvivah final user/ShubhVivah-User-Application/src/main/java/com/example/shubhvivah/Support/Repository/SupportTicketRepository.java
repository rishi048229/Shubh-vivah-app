package com.example.shubhvivah.Support.Repository;

import com.example.shubhvivah.Support.Entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(Long userId);
}
