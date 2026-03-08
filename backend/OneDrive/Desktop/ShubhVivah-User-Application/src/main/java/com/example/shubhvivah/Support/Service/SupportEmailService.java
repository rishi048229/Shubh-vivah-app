package com.example.shubhvivah.Support.Service;

import com.example.shubhvivah.Support.Entity.SupportTicket;

public interface SupportEmailService {

    void notifyAdminNewTicket(SupportTicket ticket);

    void notifyUserReply(SupportTicket ticket, String msg);
}