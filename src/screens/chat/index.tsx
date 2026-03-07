import ChatHeader from "@/components/Chat/ChatHeader";
import ChatItem from "@/components/Chat/ChatItem";
import FilterTabs from "@/components/Chat/FilterTabs";
import IcebreakerSection from "@/components/Chat/Icebreaker";
import { Colors } from "@/constants/Colors";
import { ChatConversation, ChatUser } from "@/data/mockChatData";
import api from "@/services/api";
import { getCurrentUserId } from "@/services/chatService";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChatList();
  }, []);

  const loadChatList = async () => {
    try {
      const currentUserId = await getCurrentUserId();

      // Fetch matched users from backend (users who accepted each other)
      let matchedUsers: any[] = [];
      try {
        const res = await api.get("/matches/matched");
        matchedUsers = res.data || [];
      } catch (e) {
        console.log("No matched users endpoint or error:", e);
        // Fallback: try liked users as potential chat partners
        try {
          const liked = await api.get("/matches/liked");
          matchedUsers = liked.data || [];
        } catch (e2) {
          console.log("No liked users either:", e2);
        }
      }

      // Build chat conversations from matched users
      const conversations: ChatConversation[] = [];
      for (const match of matchedUsers) {
        const otherUserId =
          match.toUserId === currentUserId
            ? match.fromUserId
            : match.toUserId || match.userId;

        if (!otherUserId) continue;

        // Try to get their profile info
        let userInfo: any = {};
        try {
          const profileRes = await api.get(
            `/matches/profile/${otherUserId}`,
          );
          userInfo = profileRes.data || {};
        } catch (e) {}

        // Try to get last message
        let lastMessage = "Tap to start chatting! 💬";
        let lastTimestamp = "New";
        try {
          const history = await api.get(
            `/chat/history?otherUserId=${otherUserId}`,
          );
          const messages = history.data || [];
          if (messages.length > 0) {
            const last = messages[messages.length - 1];
            lastMessage = last.content || last.message || "...";
            lastTimestamp = formatRelativeTime(last.sentAt);
          }
        } catch (e) {}

        const chatUser: ChatUser = {
          id: otherUserId.toString(),
          name: userInfo.fullName || `User ${otherUserId}`,
          avatar:
            userInfo.profilePhotoUrl ||
            `https://randomuser.me/api/portraits/lego/${(otherUserId % 9) + 1}.jpg`,
          isVerified: true,
          isOnline: Math.random() > 0.5,
          matchPercentage: userInfo.matchScore || 80,
        };

        conversations.push({
          id: otherUserId.toString(),
          user: chatUser,
          lastMessage,
          timestamp: lastTimestamp,
          unreadCount: 0,
          isPriority: (userInfo.matchScore || 0) > 85,
          tags:
            (userInfo.matchScore || 0) > 85
              ? ["Mutual Interest", "Verified"]
              : ["Verified"],
        });
      }

      setChats(conversations);
    } catch (e) {
      console.log("Error loading chat list:", e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChatList();
    setRefreshing(false);
  }, []);

  const priorityChats = useMemo(() => {
    return chats.filter((chat) => chat.isPriority);
  }, [chats]);

  const filteredChats = useMemo(() => {
    if (selectedFilter === "All") return chats;
    if (selectedFilter === "Unread")
      return chats.filter((c) => c.unreadCount > 0);
    if (selectedFilter === "Mutual Interest")
      return chats.filter((c) => c.tags.includes("Mutual Interest"));
    if (selectedFilter === "Verified")
      return chats.filter((c) => c.user.isVerified);
    if (selectedFilter === "New")
      return chats.filter((c) => c.tags.includes("New"));
    return chats;
  }, [selectedFilter, chats]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={Colors.maroon} />
        <Text style={{ color: "#999", marginTop: 12 }}>Loading chats...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.ivory} />

      <ChatHeader />

      <View style={styles.container}>
        <FilterTabs
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {chats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Connect with people from the Connections tab to start chatting!
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatItem chat={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                {/* Only show icebreaker if no filter or 'New' is selected */}
                {(selectedFilter === "All" || selectedFilter === "New") &&
                  chats.length > 0 && <IcebreakerSection />}
              </>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.maroon}
                colors={[Colors.maroon]}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function formatRelativeTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  } catch {
    return "Recently";
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
