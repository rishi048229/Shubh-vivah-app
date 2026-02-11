import { Colors } from "@/constants/Colors";
import { ChatConversation } from "@/data/mockChatData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PriorityRowProps {
  chats: ChatConversation[];
}

export default function PriorityRow({ chats }: PriorityRowProps) {
  const router = useRouter();

  if (chats.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Priority Conversations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/chat/[id]", params: { id: chat.id } })
            }
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: chat.user.avatar }} style={styles.avatar} />
              {chat.user.isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {chat.user.name.split(" ")[0]}
                </Text>
                {chat.user.isVerified && (
                  <Ionicons name="checkmark-circle" size={14} color="#4A90E2" />
                )}
              </View>
              <Text style={styles.match}>
                {chat.user.matchPercentage}% Match
              </Text>
            </View>
            {chat.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{chat.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D1406",
    marginLeft: 20,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 100,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  info: {
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  match: {
    fontSize: 11,
    color: Colors.maroon,
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: Colors.maroon,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
