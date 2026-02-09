import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock Notifications
const NOTIFICATIONS = [
  {
    id: "1",
    type: "match",
    title: "New Match Found!",
    description: "You matched with Priya Sharma. Say hello!",
    time: "2 mins ago",
    read: false,
    icon: "heart",
    color: "#E91E63",
  },
  {
    id: "2",
    type: "system",
    title: "Profile Verified",
    description: "Your document verification is complete.",
    time: "1 hour ago",
    read: true,
    icon: "checkmark-circle",
    color: "#4CAF50",
  },
  {
    id: "3",
    type: "user",
    title: "Rohan viewed your profile",
    description: "Rohan Das visited your profile recently.",
    time: "3 hours ago",
    read: true,
    icon: "person",
    color: "#2196F3",
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    description: "Anjali sent you a message.",
    time: "5 hours ago",
    read: false,
    icon: "chatbubble",
    color: Colors.light.gold,
  },
];

const FILTERS = ["All", "Matches", "Users", "System"];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredNotifs = NOTIFICATIONS.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Matches") return n.type === "match";
    if (activeFilter === "Users")
      return n.type === "user" || n.type === "message";
    if (activeFilter === "System") return n.type === "system";
    return true;
  });

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      style={[styles.card, !item.read && styles.unreadCard]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
      >
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {!item.read && <View style={styles.dot} />}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.maroon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            size={24}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === item && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No notifications here</Text>
          </View>
        }
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  activeFilterChip: {
    backgroundColor: Colors.light.maroon,
    borderColor: Colors.light.maroon,
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  unreadCard: {
    backgroundColor: "#fff",
    borderColor: Colors.light.gold,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: "#999",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.maroon,
    marginLeft: 8,
    marginTop: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
});
