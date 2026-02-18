import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import React, { useMemo, useState } from "react";
import {
    Image,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { Layout } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Types ---
type NotificationType = "match" | "view" | "shortlist" | "system" | "message";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string; // Display time (e.g., "24m ago")
  date: Date; // For grouping
  read: boolean;
  image?: string;
}

interface NotificationSection {
  title: string;
  data: NotificationItem[];
}

// --- Mock Data ---
const NOW = new Date();
const YESTERDAY = new Date(NOW);
YESTERDAY.setDate(NOW.getDate() - 1);
const EARLIER = new Date(NOW);
EARLIER.setDate(NOW.getDate() - 3);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "match",
    title: "New Match Found!",
    description: "Priya Sharma matches 94% with your profile.",
    time: "24m ago",
    date: NOW,
    read: false,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    type: "view",
    title: "Profile Viewed",
    description: "Anjali Gupta viewed your profile.",
    time: "2h ago",
    date: NOW,
    read: false,
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    description: "Sneha: 'Hi, I liked your profile...'",
    time: "5h ago",
    date: NOW,
    read: true,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "4",
    type: "shortlist",
    title: "You were Shortlisted",
    description: "Rohan Mehta shortlisted your profile.",
    time: "Yesterday",
    date: YESTERDAY,
    read: true,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "5",
    type: "system",
    title: "Profile Boost Expired",
    description: "Your 24h boost has ended. Boost again?",
    time: "Yesterday",
    date: YESTERDAY,
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Welcome to Shubh Vivah",
    description: "Complete your profile to get better matches.",
    time: "2d ago",
    date: EARLIER,
    read: true,
  },
];

const FILTERS = ["All", "Matches", "Messages", "Activity", "System"];

// --- Components ---

// 1. Notification Icon Helper
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  let iconName: any = "notifications";
  let color = Colors.maroon;
  let bgColor = "rgba(128, 0, 0, 0.1)";

  switch (type) {
    case "match":
      iconName = "heart";
      color = "#E11D48"; // Pink
      bgColor = "#FFF1F2";
      break;
    case "view":
      iconName = "eye";
      color = "#2563EB"; // Blue
      bgColor = "#EFF6FF";
      break;
    case "shortlist":
      iconName = "star";
      color = "#D97706"; // Amber
      bgColor = "#FFFBEB";
      break;
    case "message":
      iconName = "chatbubble";
      color = "#059669"; // Green
      bgColor = "#ECFDF5";
      break;
    case "system":
      iconName = "information-circle";
      color = "#4B5563"; // Gray
      bgColor = "#F3F4F6";
      break;
  }

  return (
    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
      <Ionicons name={iconName} size={20} color={color} />
    </View>
  );
};

// 2. Filter Chip
const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterChip, active && styles.filterChipActive]}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 3. Swipe Actions
const renderRightActions = (
  onDelete: () => void,
  onRead: () => void,
  isRead: boolean,
) => {
  return (
    <View style={styles.actionContainer}>
      {!isRead && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#3B82F6" }]}
          onPress={onRead}
        >
          <Ionicons name="checkmark-done" size={20} color="white" />
          <Text style={styles.actionText}>Read</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#EF4444" }]}
        onPress={onDelete}
      >
        <Ionicons name="trash" size={20} color="white" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Main Screen ---
export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  // Filtering Logic
  const filteredData = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Matches")
      return notifications.filter(
        (n) => n.type === "match" || n.type === "shortlist",
      );
    if (activeFilter === "Messages")
      return notifications.filter((n) => n.type === "message");
    if (activeFilter === "Activity")
      return notifications.filter((n) => n.type === "view");
    if (activeFilter === "System")
      return notifications.filter((n) => n.type === "system");
    return notifications;
  }, [notifications, activeFilter]);

  // Grouping Logic
  const sections = useMemo(() => {
    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];
    const earlier: NotificationItem[] = [];

    const now = new Date();
    filteredData.forEach((item) => {
      const diffTime = Math.abs(now.getTime() - item.date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) today.push(item);
      else if (diffDays <= 2) yesterday.push(item);
      else earlier.push(item);
    });

    const result: NotificationSection[] = [];
    if (today.length > 0) result.push({ title: "Today", data: today });
    if (yesterday.length > 0)
      result.push({ title: "Yesterday", data: yesterday });
    if (earlier.length > 0) result.push({ title: "Earlier", data: earlier });

    return result;
  }, [filteredData]);

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handlePress = (item: NotificationItem) => {
    handleMarkAsRead(item.id);
    // Navigate based on type
    if (item.type === "match" || item.type === "view") {
      // router.push(`/profile/${item.id}`); // Example
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.ivory} />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#2D1406" />
        </TouchableOpacity>
      </View>

      {/* 2. Filters */}
      <View style={styles.filterContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          style={{ maxHeight: 50 }}
        >
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </Animated.ScrollView>
      </View>

      {/* 3. Notification List */}
      {sections.length === 0 ? (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.emptyState}
        >
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#D1D5DB"
          />
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyText}>No new notifications to display.</Text>
        </MotiView>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 70, type: "timing", duration: 300 }}
              style={{ marginBottom: 12 }}
            >
              <Swipeable
                renderRightActions={() =>
                  renderRightActions(
                    () => handleDelete(item.id),
                    () => handleMarkAsRead(item.id),
                    item.read,
                  )
                }
                containerStyle={{ overflow: "visible" }} // Ensure shadow visible
              >
                <Animated.View layout={Layout.springify()}>
                  <TouchableOpacity
                    style={[styles.card, !item.read && styles.unreadCard]}
                    activeOpacity={0.9}
                    onPress={() => handlePress(item)}
                  >
                    <View style={styles.cardContent}>
                      {/* Left: Avatar/Icon */}
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.avatar}
                        />
                      ) : (
                        <NotificationIcon type={item.type} />
                      )}

                      {/* Center: Content */}
                      <View style={styles.textContainer}>
                        <View style={styles.row}>
                          <Text
                            style={[
                              styles.title,
                              !item.read && styles.unreadTitle,
                            ]}
                          >
                            {item.title}
                          </Text>
                          <Text style={styles.time}>{item.time}</Text>
                        </View>
                        <Text style={styles.description} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>

                      {/* Right: Unread Dot */}
                      {!item.read && <View style={styles.unreadDot} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </Swipeable>
            </MotiView>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9", // Very light grey/warm white
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FAFAF9",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F4",
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D1406",
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  filterChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#525252",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A1A1AA",
    marginBottom: 12,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  unreadCard: {
    backgroundColor: "#FFFBEB", // Very light gold/ivory
    borderColor: "rgba(245, 158, 11, 0.1)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "800",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D97706", // Gold
    borderWidth: 2,
    borderColor: "#FFF",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Match card margin
    paddingLeft: 12,
  },
  actionButton: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginLeft: 8,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
});
