import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";

// Mock Data
const MOCK_MESSAGES = [
  { id: "1", text: "Hey! How are you?", sender: "them", time: "10:00 AM" },
  {
    id: "2",
    text: "I am doing good, thanks for asking! matches seem great today.",
    sender: "me",
    time: "10:05 AM",
  },
  {
    id: "3",
    text: "I agree. The new features are really helpful.",
    sender: "them",
    time: "10:10 AM",
  },
];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.sender === "me";
    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        layout={Layout.springify()}
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text
          style={[styles.messageText, isMe ? styles.myText : styles.theirText]}
        >
          {item.text}
        </Text>
        <Text
          style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}
        >
          {item.time}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.maroon} />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          <Image
            source={{ uri: `https://i.pravatar.cc/150?u=${id}` }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>User {id}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={Colors.light.maroon} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#999"
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.disabledSendBtn,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 5,
  },
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerStatus: {
    fontSize: 12,
    color: "#4CAF50",
  },
  chatContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  myBubble: {
    backgroundColor: Colors.light.maroon,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 15,
  },
  myText: {
    color: "#fff",
  },
  theirText: {
    color: "#333",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myTime: {
    color: "rgba(255,255,255,0.7)",
  },
  theirTime: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachBtn: {
    marginRight: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: "#333",
  },
  sendBtn: {
    backgroundColor: Colors.light.maroon,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  disabledSendBtn: {
    backgroundColor: "#ccc",
  },
});
