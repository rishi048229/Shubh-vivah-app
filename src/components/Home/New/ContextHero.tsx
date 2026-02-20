import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContextHeroProps {
  userName: string;
  userAvatar: string;
  contextText: string;
  location?: string;
  onAvatarPress?: () => void;
}

export default function ContextHero({
  userName,
  userAvatar,
  contextText,
  location,
  onAvatarPress,
}: ContextHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onAvatarPress}
        >
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          {/* Online Indicator */}
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>

        {/* Text Context */}
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            Hello, <Text style={styles.userName}>{userName}</Text>
          </Text>
          <Text style={styles.contextText}>{contextText}</Text>
          {location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#666" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          )}
        </View>

        {/* Notification Icon (Optional, can be added here) */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => console.log("Notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.ivory,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFF", // Or theme color
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#000",
  },
  userName: {
    fontWeight: "bold",
  },
  contextText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  locationText: {
    fontSize: 11,
    color: "#666",
  },
  actions: {
    marginLeft: "auto",
  },
});
