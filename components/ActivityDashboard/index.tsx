import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

interface ActivityCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  count: string;
  countColor?: string;
  onPress?: () => void;
}

const ActivityCard = ({
  icon,
  label,
  count,
  countColor = "#2D1406",
  onPress,
}: ActivityCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={22} color={Colors.maroon} />
    </View>
    <View style={styles.textContainer}>
      <Text style={[styles.count, { color: countColor }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={16}
      color="#CCC"
      style={styles.arrow}
    />
  </TouchableOpacity>
);

export default function ActivityDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Activity</Text>
      </View>

      <View style={styles.grid}>
        <ActivityCard
          icon="heart"
          label="Liked You"
          count="12"
          onPress={() => {}}
        />
        <ActivityCard
          icon="eye"
          label="Profile Views"
          count="48"
          onPress={() => {}}
        />
        <ActivityCard
          icon="chatbubbles"
          label="Unread Chats"
          count="3"
          countColor={Colors.maroon}
          onPress={() => router.push("/chat" as any)}
        />
        <ActivityCard
          icon="star"
          label="Shortlisted"
          count="8"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D1406",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDF2F2", // Light red bg
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  count: {
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  arrow: {
    opacity: 0.6,
  },
});
