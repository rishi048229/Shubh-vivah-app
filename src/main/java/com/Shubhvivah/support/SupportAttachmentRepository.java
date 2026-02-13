package com.Shubhvivah.support;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportAttachmentRepository
        extends JpaRepository<SupportAttachment, Long> {

    List<SupportAttachment> findByMessageId(Long messageId);
}
