package com.Shubhvivah.chat;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class OnlineUsers {

    private static final Set<Long> online = ConcurrentHashMap.newKeySet();

    public static void userOnline(Long userId) {
        online.add(userId);
    }

    public static void userOffline(Long userId) {
        online.remove(userId);
    }

    public static boolean isOnline(Long userId) {
        return online.contains(userId);
    }
}
