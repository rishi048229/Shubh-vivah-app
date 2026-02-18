import ChatHeader from "@/components/Chat/ChatHeader";
import ChatList from "@/components/Chat/ChatList";
import FilterTabs from "@/components/Chat/FilterTabs";
import IcebreakerSection from "@/components/Chat/Icebreaker";
import PriorityRow from "@/components/Chat/PriorityRow";
import { Colors } from "@/constants/Colors";
import { MOCK_CHATS } from "@/data/mockChatData";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const priorityChats = useMemo(() => {
    return MOCK_CHATS.filter((chat) => chat.isPriority);
  }, []);

  const filteredChats = useMemo(() => {
    if (selectedFilter === "All") return MOCK_CHATS;
    if (selectedFilter === "Unread")
      return MOCK_CHATS.filter((c) => c.unreadCount > 0);
    if (selectedFilter === "Mutual Interest")
      return MOCK_CHATS.filter((c) => c.tags.includes("Mutual Interest"));
    if (selectedFilter === "Verified")
      return MOCK_CHATS.filter((c) => c.user.isVerified);
    if (selectedFilter === "New")
      return MOCK_CHATS.filter((c) => c.tags.includes("New"));
    return MOCK_CHATS;
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.ivory} />

      <ChatHeader />

      <View style={styles.container}>
        <PriorityRow chats={priorityChats} />

        <FilterTabs
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {/* Only show icebreaker if no filter or 'New' is selected */}
        {(selectedFilter === "All" || selectedFilter === "New") && (
          <IcebreakerSection />
        )}

        <ChatList chats={filteredChats} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  container: {
    flex: 1,
  },
});
