import { Colors } from "@/constants/Colors";
import {
    ChatMessage,
    getChatHistory,
    sendMessage,
} from "@/services/chatService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [targetUser, setTargetUser] = useState<any>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Polling for new messages
  useEffect(() => {
    if (!id) return;

    const fetchChat = async () => {
      try {
        // 1. Get Target User Details (mock for now if getProfile by ID not avail, or fetch)
        // simplified: we just assume ID is valid.
        // In real app, we need name/avatar. Let's assume passed via params or fetch.
        // For now, let's just fetch history.

        // TODO: Get current user ID from storage or context.
        // Hardcoded '1' as current user for demo if not in storage, but we need it.
        // We'll assume 'currentUserId' is 1 for now or fetch it.
        const currentUserId = 1; // REPLACE WITH REAL ID
        const targetId = Number(id);

        const history = await getChatHistory(currentUserId, targetId);
        setMessages(history);
      } catch (e) {
        console.log("Chat error", e);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [id]);

  const handleSend = async () => {
    if (message.trim()) {
      try {
        const currentUserId = 1; // REPLACE
        const targetId = Number(id);
        await sendMessage(currentUserId, targetId, message.trim());
        setMessage("");
        // Refresh immediately
        const history = await getChatHistory(currentUserId, targetId);
        setMessages(history);
      } catch (e) {
        Alert.alert("Error", "Failed to send");
      }
    }
  };

  const handleAttach = () => {
    Alert.alert("Coming Soon", "Image attachment will be available soon.");
  };

  const handleOptions = () => {
    Alert.alert("Options", "Block / Report user");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100,
    );
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>

        <Image
          source={{ uri: "https://randomuser.me/api/portraits/lego/1.jpg" }}
          style={styles.avatar}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{targetUser?.name || `User ${id}`}</Text>
          <Text style={styles.status}>Online • 85% Match</Text>
        </View>

        <TouchableOpacity onPress={handleOptions}>
          <Ionicons name="ellipsis-vertical" size={24} color="#2D1406" />
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

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.senderId === 1 ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.senderId === 1 && styles.myMessageText,
              ]}
            >
              {msg.content || msg.message}
            </Text>
            <Text style={styles.timeText}>{msg.sentAt}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAttach}>
            <Ionicons name="add" size={24} color={Colors.maroon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D1406",
  },
  status: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  systemMessage: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  theirMessage: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 4,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessage: {
    backgroundColor: Colors.maroon,
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  myMessageText: {
    color: "#FFF",
  },
  timeText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.maroon,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
