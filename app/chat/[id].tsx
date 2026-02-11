import { Colors } from "@/constants/Colors";
import { MOCK_CHATS } from "@/data/mockChatData";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const chat = MOCK_CHATS.find((c) => c.id === id);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: chat?.lastMessage || "Hi!",
      sender: "them",
      time: "10:00 AM",
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: message, sender: "me", time: "Now" },
      ]);
      setMessage("");
    }
  };

  if (!chat) {
    return (
      <View style={styles.center}>
        <Text>Chat not found</Text>
      </View>
    );
  }

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

        <Image source={{ uri: chat.user.avatar }} style={styles.avatar} />

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.status}>
            {chat.user.isOnline ? "Online" : "Offline"} •{" "}
            {chat.user.matchPercentage}% Match
          </Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#2D1406" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessage}>
            You matched with {chat.user.name} on {chat.timestamp}
          </Text>
        </View>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.sender === "me" && styles.myMessageText,
              ]}
            >
              {msg.text}
            </Text>
            <Text style={styles.timeText}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
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
