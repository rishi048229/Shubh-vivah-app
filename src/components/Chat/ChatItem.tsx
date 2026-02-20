import { Colors } from "@/constants/Colors";
import { ChatConversation } from "@/data/mockChatData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatItemProps {
  chat: ChatConversation;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({ pathname: "/chat/[id]", params: { id: chat.id } })
      }
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: chat.user.avatar }} style={styles.avatar} />
          {chat.user.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{chat.user.name}</Text>
              {chat.user.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#4A90E2" />
              )}
            </View>
            <Text style={styles.time}>{chat.timestamp}</Text>
          </View>

          <Text style={styles.matchTag}>
            {chat.user.matchPercentage}% Match
          </Text>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.message,
                chat.unreadCount > 0 && styles.messageUnread,
              ]}
              numberOfLines={1}
            >
              {chat.lastMessage}
            </Text>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  left: {
    flexDirection: "row",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D1406",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  matchTag: {
    fontSize: 12,
    color: Colors.maroon,
    fontWeight: "600",
    marginBottom: 2,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 10,
  },
  messageUnread: {
    color: "#000",
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: Colors.maroon,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
