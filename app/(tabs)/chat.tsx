import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock Data for Chats
const CHATS = [
  {
    id: "1",
    name: "Rohan Das",
    message: "That sounds great! let's meet up...",
    time: "10:30 AM",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?img=11",
    online: true,
    matchPercentage: 95,
  },
  {
    id: "2",
    name: "Priya Sharma",
    message: "Sent a photo",
    time: "Yesterday",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?img=5",
    online: false,
    matchPercentage: 88,
  },
  {
    id: "3",
    name: "Anjali Gupta",
    message: "Can we connect on call?",
    time: "Yesterday",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?img=9",
    online: true,
    matchPercentage: 92,
  },
];

const TABS = ["All", "Unread", "Matches", "Requests", "Archived"];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profileData } = useProfile();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = CHATS.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Unread" && chat.unread > 0) ||
      activeTab === "Matches" || // Show all for now
      (activeTab === "Requests" && false) || // No mock data
      (activeTab === "Archived" && false);

    return matchesSearch && matchesTab;
  });

  const renderChatItem = ({
    item,
    index,
  }: {
    item: (typeof CHATS)[0];
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.chatCardContainer}
    >
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          router.push({ pathname: "/chat/[id]", params: { id: item.id } })
        }
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[styles.message, item.unread > 0 && styles.unreadMessage]}
              numberOfLines={1}
            >
              {item.message}
            </Text>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>

        {item.matchPercentage && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{item.matchPercentage}%</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="create-outline"
            size={24}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item && styles.activeTab]}
              onPress={() => setActiveTab(item)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  tabsContainer: {
    marginBottom: 15,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  activeTab: {
    backgroundColor: Colors.light.maroon,
    borderColor: Colors.light.maroon,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  chatCardContainer: {
    marginBottom: 12,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.8)", // Glassmorphic effect
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    borderColor: "#fff",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
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
  unreadMessage: {
    color: "#333",
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: Colors.light.maroon,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  matchBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.light.gold, // Changed from lightGold to gold
    // If lightGold is not defined in Colors, use a hex or define it. Assuming gold exists based on context.
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 10,
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
});
