import { Colors } from "@/constants/Colors";
import {
  ChatMessage,
  connectWebSocket,
  disconnectWebSocket,
  getChatHistory,
  getChatKey,
  getCurrentUserId,
  markSeen,
  sendMessage,
  sendTyping,
  subscribeToMessages,
  subscribeToTyping,
  deleteMessage,
  editMessage,
  TypingEvent,
  checkUserOnline,
  subscribeToPresence,
} from "@/services/chatService";
import {
  blockUser,
  reportUser,
  viewFullProfile,
} from "@/services/matchService";
import { getAvatarUrl } from "@/utils/avatar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";

// --- Smart Suggestions for shy users ---
const ICEBREAKER_SUGGESTIONS = [
  "Hi! Your profile looks interesting 😊",
  "What do you enjoy doing on weekends?",
  "I noticed we share similar interests!",
  "Hello! Tell me more about yourself ✨",
  "What's your favorite travel destination?",
  "Do you enjoy cooking? I'd love to swap recipes!",
];

function formatTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoStr;
  }
}

export default function ChatDetailScreen() {
  const { id, name: paramName, avatar: paramAvatar, isOnline: paramIsOnline } = useLocalSearchParams();
  const router = useRouter();

  // State
  const [currentUserId, setCurrentUserId] = useState(0);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const targetId = Number(id);

  // Android keyboard listener (edgeToEdge breaks adjustResize)
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // --- Initialize: get user id, load profile, load history, connect WS ---
  useEffect(() => {
    let mounted = true;
    let unsubscribeMessages: (() => void) | null = null;
    let unsubscribeTyping: (() => void) | null = null;
    let unsubscribePresence: (() => void) | null = null;

    const init = async () => {
      try {
        // 1. Get current user ID
        const uid = await getCurrentUserId();
        if (mounted) setCurrentUserId(uid);

        // 2. Get target user profile
        try {
          const profile = await viewFullProfile(targetId);
          // Check real online status from backend
          const onlineStatus = await checkUserOnline(targetId);
          if (mounted && profile) {
            setTargetUser({
              name: profile.fullName || paramName || `User ${id}`,
              avatar: getAvatarUrl(
                profile.profilePhotoUrl || paramAvatar as string | undefined,
                profile.gender,
                profile.fullName || paramName as string | undefined
              ),
              age: profile.age,
              city: profile.city,
              matchScore: profile.matchScore,
              isOnline: onlineStatus,
            });
          }
        } catch (e) {
          if (mounted) {
            setTargetUser({
              name: paramName || `User ${id}`,
              avatar: getAvatarUrl(
                paramAvatar as string | undefined,
                null,
                paramName as string | undefined
              ),
              isOnline: paramIsOnline === "true",
            });
          }
        }

        // 3. Load chat history (Step 1)
        try {
          const history = await getChatHistory(targetId);
          if (mounted) {
            setMessages(history);
            setShowSuggestions(history.length === 0);
          }
        } catch (e) {
          console.log("No chat history:", e);
          if (mounted) setShowSuggestions(true);
        }

        // 4. Connect WebSocket (Step 2)
        try {
          await connectWebSocket();
          if (mounted) setConnected(true);

          // 5. Subscribe to messages (Step 3)
          const chatKey = getChatKey(uid, targetId);

          unsubscribeMessages = subscribeToMessages(chatKey, (msg: ChatMessage) => {
            if (mounted) {
              setMessages((prev) => {
                // Check if message already exists (by id)
                const exists = prev.find((m) => m.id === msg.id);
                if (exists) {
                  // Update existing (for edits/deletes)
                  return prev.map((m) => (m.id === msg.id ? msg : m));
                }
                return [...prev, msg];
              });
              setShowSuggestions(false);
              // Mark as seen
              if (msg.senderId !== uid) {
                markSeen(msg.id, uid);
              }
            }
          });

          // Subscribe to typing
          let typingHideTimeout: NodeJS.Timeout | null = null;
          unsubscribeTyping = subscribeToTyping(chatKey, (event: TypingEvent) => {
            if (mounted && String(event.from) !== String(uid)) {
              setIsTyping(event.typing);
              
              if (typingHideTimeout) clearTimeout(typingHideTimeout);
              
              // Auto-hide after 3 seconds
              if (event.typing) {
                typingHideTimeout = setTimeout(() => {
                  if (mounted) setIsTyping(false);
                }, 3000);
              }
            }
          });

          // Subscribe to presence updates
          unsubscribePresence = subscribeToPresence((event: { userId: number; status: string }) => {
            if (mounted && event.userId === targetId) {
              setTargetUser((prev: any) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  isOnline: event.status === "ONLINE",
                };
              });
            }
          });
        } catch (e) {
          console.log("WebSocket connection failed, falling back to polling:", e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      // Do not disconnect WebSocket globally so back toast notifications keep working
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeTyping) unsubscribeTyping();
      if (unsubscribePresence) unsubscribePresence();
    };
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      150,
    );
  }, [messages]);

  // --- Handlers ---

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    if (editingMessage) {
      // Edit mode
      editMessage(editingMessage.id, message.trim());
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessage.id ? { ...m, content: message.trim() } : m,
        ),
      );
      setEditingMessage(null);
      setMessage("");
      return;
    }

    // Send new message (Step 4)
    sendMessage(currentUserId, targetId, message.trim());
    setMessage("");
    setShowSuggestions(false);

    // Stop typing
    sendTyping(currentUserId, targetId, false);
  }, [message, currentUserId, targetId, editingMessage]);

  const handleSuggestionPress = (text: string) => {
    setMessage(text);
    setShowSuggestions(false);
  };

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Typing indicator
    if (text.length > 0) {
      if (!typingTimeoutRef.current) {
        sendTyping(currentUserId, targetId, true);
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(currentUserId, targetId, false);
        typingTimeoutRef.current = null;
      }, 2000);
    } else {
      sendTyping(currentUserId, targetId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleMessageLongPress = (msg: ChatMessage) => {
    if (msg.senderId !== currentUserId) return; // Only own messages

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Edit", "Delete", "Cancel"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0) {
            setEditingMessage(msg);
            setMessage(msg.content || msg.message || "");
          } else if (index === 1) {
            handleDeleteMessage(msg.id);
          }
        },
      );
    } else {
      Alert.alert("Message Options", "What would you like to do?", [
        {
          text: "Edit",
          onPress: () => {
            setEditingMessage(msg);
            setMessage(msg.content || msg.message || "");
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteMessage(msg.id),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleDeleteMessage = (msgId: number) => {
    Alert.alert("Delete Message", "This message will be deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMessage(msgId);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? { ...m, deleted: true, content: "This message was deleted" }
                : m,
            ),
          );
        },
      },
    ]);
  };

  const handleOptionsMenu = () => {
    setShowOptionsSheet(true);
  };

  const handleBlockUser = async () => {
    try {
      await blockUser(targetId);
      Alert.alert("Blocked", "User has been blocked.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to block user.");
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert("Error", "Please provide a reason.");
      return;
    }
    try {
      await reportUser(targetId, reportReason.trim());
      Alert.alert("Reported", "Thank you for reporting.");
      setShowReportSheet(false);
      setReportReason("");
    } catch (e) {
      Alert.alert("Error", "Failed to report.");
    }
  };

  // --- Render ---

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={Colors.maroon} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerProfile}
          onPress={() => router.push(`/profile/${targetId}`)}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  targetUser?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
            {targetUser?.isOnline && <View style={styles.onlineBadge} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {targetUser?.name || `User ${id}`}
            </Text>
            <Text style={[styles.status, targetUser?.isOnline ? { color: "#10B981" } : { color: "#9CA3AF" }]}>
              {isTyping
                ? "typing..."
                : (targetUser?.isOnline ? "Online" : "Offline")}
              {targetUser?.matchScore
                ? ` • ${targetUser.matchScore}% Match`
                : ""}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOptionsMenu} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={22} color="#2D1406" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessage}>Start of your conversation</Text>
        </View>

        {/* Smart Suggestions (when chat is empty) */}
        {showSuggestions && messages.length === 0 && (
          <Animated.View
            entering={FadeInUp.duration(400).springify()}
            style={styles.suggestionsContainer}
          >
            <Ionicons name="sparkles" size={24} color={Colors.maroon} />
            <Text style={styles.suggestionsTitle}>
              Not sure what to say? Try one of these!
            </Text>
            <View style={styles.suggestionsList}>
              {ICEBREAKER_SUGGESTIONS.map((suggestion, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {messages.map((msg, index) => (
          <View key={msg.id}>
            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => handleMessageLongPress(msg)}
              style={[
                styles.messageBubble,
                msg.senderId === currentUserId
                  ? styles.myMessage
                  : styles.theirMessage,
                msg.deleted && styles.deletedMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.senderId === currentUserId && styles.myMessageText,
                  msg.deleted && styles.deletedText,
                ]}
              >
                {msg.deleted
                  ? "🚫 This message was deleted"
                  : msg.content || msg.message}
              </Text>
              <View style={styles.messageFooter}>
                <Text
                  style={[
                    styles.timeText,
                    msg.senderId === currentUserId && { color: "rgba(255,255,255,0.6)" },
                  ]}
                >
                  {formatTime(msg.sentAt)}
                </Text>
                {msg.senderId === currentUserId && !msg.deleted && (
                  <Ionicons
                    name={msg.seen ? "checkmark-done" : msg.delivered ? "checkmark-done-outline" : "checkmark"}
                    size={14}
                    color={msg.seen ? "#60A5FA" : "rgba(255,255,255,0.5)"}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.typingContainer}
          >
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { opacity: 0.4 }]} />
                <View style={[styles.typingDot, { opacity: 0.7 }]} />
                <View style={[styles.typingDot, { opacity: 1 }]} />
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Edit Mode Banner */}
      {editingMessage && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={styles.editBanner}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.editBannerTitle}>Editing Message</Text>
            <Text style={styles.editBannerText} numberOfLines={1}>
              {editingMessage.content || editingMessage.message}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEditingMessage(null);
              setMessage("");
            }}
          >
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Input */}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={90}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() =>
                Alert.alert("Coming Soon", "Image attachment will be available soon.")
              }
            >
              <Ionicons name="add-circle-outline" size={26} color={Colors.maroon} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder={
                editingMessage ? "Edit your message..." : "Type a message..."
              }
              placeholderTextColor="#999"
              value={message}
              onChangeText={handleTextChange}
              multiline
              maxLength={1000}
            />

            {message.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons
                  name={editingMessage ? "checkmark" : "send"}
                  size={20}
                  color="#FFF"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: "#E5E5E5" }]}
                disabled
              >
                <Ionicons name="send" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ paddingBottom: keyboardHeight }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() =>
                Alert.alert("Coming Soon", "Image attachment will be available soon.")
              }
            >
              <Ionicons name="add-circle-outline" size={26} color={Colors.maroon} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder={
                editingMessage ? "Edit your message..." : "Type a message..."
              }
              placeholderTextColor="#999"
              value={message}
              onChangeText={handleTextChange}
              multiline
              maxLength={1000}
            />

            {message.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons
                  name={editingMessage ? "checkmark" : "send"}
                  size={20}
                  color="#FFF"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: "#E5E5E5" }]}
                disabled
              >
                <Ionicons name="send" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* --- Advanced Options Bottom Sheet --- */}
      <Modal visible={showOptionsSheet} transparent animationType="fade" onRequestClose={() => setShowOptionsSheet(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptionsSheet(false)}>
          <Animated.View style={styles.bottomSheet} entering={SlideInDown.duration(300).springify()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Chat Options</Text>

            <TouchableOpacity style={styles.sheetOption} onPress={() => { setShowOptionsSheet(false); router.push(`/profile/${targetId}`); }}>
              <View style={[styles.sheetIconBg, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="person-outline" size={20} color="#374151" />
              </View>
              <Text style={styles.sheetOptionText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={() => { setShowOptionsSheet(false); setShowReportSheet(true); }}>
              <View style={[styles.sheetIconBg, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="flag-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.sheetOptionText, { color: '#EF4444' }]}>Report User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={() => {
              setShowOptionsSheet(false);
              Alert.alert(
                "Block User",
                `Are you sure you want to block ${targetUser?.name || "this user"}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Block", style: "destructive", onPress: handleBlockUser }
                ]
              );
            }}>
              <View style={[styles.sheetIconBg, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="ban-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.sheetOptionText, { color: '#EF4444' }]}>Block User</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* --- Report Modal --- */}
      <Modal visible={showReportSheet} transparent animationType="fade" onRequestClose={() => setShowReportSheet(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowReportSheet(false)}>
            <Animated.View style={styles.reportModal} entering={FadeInUp.duration(300).springify()}>
              <Ionicons name="shield-checkmark" size={40} color={Colors.maroon} style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text style={styles.reportModalTitle}>Report User</Text>
              <Text style={styles.reportModalDesc}>Please let us know why you are reporting this user. Your report is kept strictly confidential.</Text>
              
              <TextInput
                style={styles.reportInput}
                placeholder="Type your reason here..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={reportReason}
                onChangeText={setReportReason}
              />

              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.reportCancelBtn} onPress={() => setShowReportSheet(false)}>
                  <Text style={styles.reportCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportSubmitBtn} onPress={handleSubmitReport}>
                  <Text style={styles.reportSubmitText}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAF8",
    paddingTop: Platform.OS === "android" ? 30 : 50,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 6,
    marginRight: 4,
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#FFF1F2",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "#10B981", // Green dot
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D1406",
  },
  status: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  systemMessage: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: "500",
  },
  // Suggestions
  suggestionsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#FFF1F2",
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 14,
    textAlign: "center",
  },
  suggestionsList: {
    width: "100%",
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: "#FFF8F8",
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
  },
  // Messages
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  theirMessage: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  myMessage: {
    backgroundColor: Colors.maroon,
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  deletedMessage: {
    opacity: 0.6,
  },
  messageText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 21,
  },
  myMessageText: {
    color: "#FFF",
  },
  deletedText: {
    fontStyle: "italic",
    color: "#9CA3AF",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  // Typing
  typingContainer: {
    paddingVertical: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  typingBubble: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    alignSelf: "flex-start",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
  },
  // Edit banner
  editBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,0,0,0.1)",
    gap: 12,
  },
  editBannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.maroon,
  },
  editBannerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 10,
  },
  attachButton: {
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 15,
    maxHeight: 120,
    color: "#1F2937",
  },
  sendButton: {
    backgroundColor: Colors.maroon,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  sheetOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  reportModal: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    margin: 24,
    marginBottom: "auto",
    marginTop: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  reportModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  reportModalDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  reportInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 24,
  },
  reportActions: {
    flexDirection: "row",
    gap: 12,
  },
  reportCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  reportCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  reportSubmitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.maroon,
    alignItems: "center",
  },
  reportSubmitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
});
