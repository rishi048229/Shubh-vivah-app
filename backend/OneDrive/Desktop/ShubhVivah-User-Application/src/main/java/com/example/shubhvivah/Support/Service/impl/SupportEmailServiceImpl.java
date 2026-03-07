package com.example.shubhvivah.Support.Service.impl;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.example.shubhvivah.Support.Entity.SupportTicket;
import com.example.shubhvivah.Support.Service.SupportEmailService;

@Service
@RequiredArgsConstructor
public class SupportEmailServiceImpl implements SupportEmailService {

    private final JavaMailSender mailSender;

    private static final String ADMIN_EMAIL = "support@shubhvivah.ltd";

    @Override
    public void notifyAdminNewTicket(SupportTicket ticket) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(ADMIN_EMAIL);
        mail.setTo(ADMIN_EMAIL);
        mail.setSubject("New Support Ticket #" + ticket.getId());
        mail.setText(ticket.getSubject() + "\n\n" + ticket.getMessage());

        mailSender.send(mail);
    }

    @Override
    public void notifyUserReply(SupportTicket ticket, String msg) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(ADMIN_EMAIL);
        mail.setTo("user@email.com"); // TODO fetch from DB
        mail.setSubject("Reply on Ticket #" + ticket.getId());
        mail.setText(msg);

        mailSender.send(mail);
    }
}