import { ChatConversation } from "@/data/mockChatData";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatItem from "./ChatItem";

interface ChatListProps {
  chats: ChatConversation[];
}

export default function ChatList({ chats }: ChatListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem chat={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});
