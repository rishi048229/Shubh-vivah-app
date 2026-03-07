import { Colors } from "@/constants/Colors";
import * as profileService from "@/services/profileService";
import { acceptRequest } from "@/services/matchService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Types ---
type NotificationType = "match" | "view" | "shortlist" | "system" | "message" | "request";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  date: Date;
  read: boolean;
  image?: string;
  fromUserId?: number; // For request type
}

interface NotificationSection {
  title: string;
  data: NotificationItem[];
}

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
      color = "#E11D48";
      bgColor = "#FFF1F2";
      break;
    case "view":
      iconName = "eye";
      color = "#2563EB";
      bgColor = "#EFF6FF";
      break;
    case "shortlist":
      iconName = "star";
      color = "#D97706";
      bgColor = "#FFFBEB";
      break;
    case "message":
      iconName = "chatbubble";
      color = "#059669";
      bgColor = "#ECFDF5";
      break;
    case "request":
      iconName = "person-add";
      color = "#7C3AED";
      bgColor = "#F5F3FF";
      break;
    case "system":
      iconName = "information-circle";
      color = "#4B5563";
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [userName, setUserName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Load user profile and generate personalized notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    let fullName = "User";
    try {
      const profile = await profileService.getProfile();
      if (profile && profile.fullName) {
        fullName = profile.fullName;
        setUserName(fullName);
      }
    } catch (e) {
      console.log("Could not load profile for notifications", e);
    }

    const NOW = new Date();
    const YESTERDAY = new Date(NOW);
    YESTERDAY.setDate(NOW.getDate() - 1);
    const EARLIER = new Date(NOW);
    EARLIER.setDate(NOW.getDate() - 3);

    const firstName = fullName.split(" ")[0];

    // Generate personalized notifications
    const generated: NotificationItem[] = [
      // Welcome & onboarding
      {
        id: "welcome-1",
        type: "system",
        title: `Welcome, ${firstName}! 🎉`,
        description: `We're thrilled to have you on Shubh Vivah. Complete your profile now to start finding your perfect match.`,
        time: "Just now",
        date: NOW,
        read: false,
      },
      {
        id: "profile-reminder",
        type: "system",
        title: "Complete Your Profile",
        description: `${firstName}, profiles with photos and details get 10x more responses. Add your photo and bio to stand out!`,
        time: "1h ago",
        date: NOW,
        read: false,
      },
      // Sample interaction notifications
      {
        id: "match-1",
        type: "match",
        title: "New Match Found!",
        description: "Priya Sharma matches 94% with your profile.",
        time: "2h ago",
        date: NOW,
        read: false,
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      {
        id: "view-1",
        type: "view",
        title: "Profile Viewed",
        description: "Anjali Gupta viewed your profile.",
        time: "3h ago",
        date: NOW,
        read: false,
        image: "https://randomuser.me/api/portraits/women/12.jpg",
      },
      {
        id: "msg-1",
        type: "message",
        title: "New Message",
        description: "Sneha: 'Hi, I liked your profile...'",
        time: "5h ago",
        date: NOW,
        read: true,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "shortlist-1",
        type: "shortlist",
        title: "You were Shortlisted",
        description: "Rohan Mehta shortlisted your profile.",
        time: "Yesterday",
        date: YESTERDAY,
        read: true,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "tip-1",
        type: "system",
        title: "Pro Tip 💡",
        description: `${firstName}, users who add their horoscope details get 40% better match recommendations!`,
        time: "Yesterday",
        date: YESTERDAY,
        read: true,
      },
      {
        id: "like-1",
        type: "match",
        title: "Someone Liked You! ❤️",
        description: "A new person has liked your profile. Check who it is!",
        time: "2d ago",
        date: EARLIER,
        read: true,
      },
      {
        id: "system-welcome",
        type: "system",
        title: "Welcome to Shubh Vivah",
        description:
          "Your journey to finding a life partner starts here. We wish you all the best!",
        time: "2d ago",
        date: EARLIER,
        read: true,
      },
      // Match request notification
      {
        id: "request-1",
        type: "request",
        title: "New Match Request! 💌",
        description: "Neha Patel wants to connect with you. Accept to start chatting!",
        time: "1d ago",
        date: YESTERDAY,
        read: false,
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        fromUserId: 5,
      },
    ];

    setNotifications(generated);
    setIsLoaded(true);
  };

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
    // Show full notification in popup
    setSelectedNotification(item);
  };

  const handleModalAction = (item: NotificationItem) => {
    setSelectedNotification(null);
    if (item.id === "profile-reminder" || item.id === "welcome-1") {
      router.push("/complete-profile" as any);
    }
  };

  const handleAcceptRequest = async (item: NotificationItem) => {
    if (!item.fromUserId) return;
    try {
      await acceptRequest(item.fromUserId);
      setSelectedNotification(null);
      // Update notification
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                title: "Request Accepted! ✅",
                description: `You and ${item.title.includes("Neha") ? "Neha" : "this user"} are now connected! Start chatting.`,
                type: "match" as NotificationType,
                read: true,
              }
            : n,
        ),
      );
      // Navigate to chat
      router.push({ pathname: "/chat/[id]", params: { id: item.fromUserId.toString() } });
    } catch (e: any) {
      setSelectedNotification(null);
      Alert.alert("Error", e?.response?.data || "Could not accept request.");
    }
  };

  const handleDeclineRequest = (item: NotificationItem) => {
    setSelectedNotification(null);
    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.ivory} />

      {/* Notification Detail Modal */}
      <Modal
        visible={!!selectedNotification}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotification(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedNotification(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                entering={FadeInDown.duration(300).springify().damping(18)}
                style={styles.modalContent}
              >
                {/* Close button */}
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setSelectedNotification(null)}
                >
                  <Ionicons name="close" size={22} color="#999" />
                </TouchableOpacity>

                {/* Icon / Avatar */}
                {selectedNotification?.image ? (
                  <Image
                    source={{ uri: selectedNotification.image }}
                    style={styles.modalAvatar}
                  />
                ) : (
                  <View style={styles.modalIconWrap}>
                    <NotificationIcon type={selectedNotification?.type || "system"} />
                  </View>
                )}

                {/* Title */}
                <Text style={styles.modalTitle}>
                  {selectedNotification?.title}
                </Text>

                {/* Time */}
                <Text style={styles.modalTime}>
                  {selectedNotification?.time}
                </Text>

                {/* Full Message */}
                <View style={styles.modalMessageBox}>
                  <Text style={styles.modalMessage}>
                    {selectedNotification?.description}
                  </Text>
                </View>

                {/* Action Button — Profile Completion */}
                {(selectedNotification?.id === "profile-reminder" ||
                  selectedNotification?.id === "welcome-1") && (
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={() => handleModalAction(selectedNotification!)}
                  >
                    <Text style={styles.modalActionText}>Complete Profile</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                  </TouchableOpacity>
                )}

                {/* Action Buttons — Match Request Accept/Decline */}
                {selectedNotification?.type === "request" && selectedNotification?.fromUserId && (
                  <View style={styles.modalRequestActions}>
                    <TouchableOpacity
                      style={[styles.modalActionBtn, { flex: 1, backgroundColor: "#10B981" }]}
                      onPress={() => handleAcceptRequest(selectedNotification!)}
                    >
                      <Ionicons name="checkmark" size={18} color="#FFF" />
                      <Text style={styles.modalActionText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalActionBtn, { flex: 1, backgroundColor: "#EF4444" }]}
                      onPress={() => handleDeclineRequest(selectedNotification!)}
                    >
                      <Ionicons name="close" size={18} color="#FFF" />
                      <Text style={styles.modalActionText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Dismiss */}
                <TouchableOpacity
                  style={styles.modalDismissBtn}
                  onPress={() => setSelectedNotification(null)}
                >
                  <Text style={styles.modalDismissText}>Dismiss</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            // Mark all as read
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true })),
            );
          }}
        >
          <Ionicons name="checkmark-done" size={22} color="#2D1406" />
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
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.emptyState}
        >
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#D1D5DB"
          />
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyText}>No new notifications to display.</Text>
        </Animated.View>
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
            <Animated.View
              entering={FadeInDown.delay(index * 60)
                .duration(300)
                .springify()
                .damping(18)}
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
                containerStyle={{ overflow: "visible" }}
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
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
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
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D1406",
  },
  unreadBadge: {
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
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
    backgroundColor: "#FFFBEB",
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
    backgroundColor: "#D97706",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#FFF1F2",
  },
  modalIconWrap: {
    marginBottom: 16,
    transform: [{ scale: 1.4 }],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 6,
  },
  modalTime: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 16,
  },
  modalMessageBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  modalMessage: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textAlign: "center",
  },
  modalActionBtn: {
    flexDirection: "row",
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
  },
  modalActionText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  modalDismissBtn: {
    paddingVertical: 10,
  },
  modalDismissText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalRequestActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 12,
  },
});
