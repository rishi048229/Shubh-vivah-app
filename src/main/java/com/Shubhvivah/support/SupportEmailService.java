package com.Shubhvivah.support;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupportEmailService {

    private final JavaMailSender mailSender;

    private static final String ADMIN_EMAIL = "support@shubhvivah.ltd";

    public void notifyAdminNewTicket(SupportTicket ticket) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("support@shubhvivah.ltd");
        mail.setTo(ADMIN_EMAIL);
        mail.setSubject("New Support Ticket #" + ticket.getId());
        mail.setText(ticket.getSubject() + "\n\n" + ticket.getMessage());

        mailSender.send(mail);
    }

    public void notifyUserReply(SupportTicket ticket, String msg) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("support@shubhvivah.ltd");
        mail.setTo("user@email.com"); // fetch user email from DB
        mail.setSubject("Reply on Ticket #" + ticket.getId());
        mail.setText(msg);

        mailSender.send(mail);
    }
}
