package com.example.shubhvivah.Support.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.shubhvivah.Support.Entity.SupportAttachment;

public interface SupportAttachmentRepository
        extends JpaRepository<SupportAttachment, Long> {

    List<SupportAttachment> findByMessageId(Long messageId);
}
