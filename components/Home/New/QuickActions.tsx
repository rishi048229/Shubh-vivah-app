import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface QuickActionItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  { id: "1", label: "Search", icon: "search-outline" },
  { id: "2", label: "Preferences", icon: "options-outline" },
  { id: "3", label: "Nearby", icon: "location-outline" },
  { id: "4", label: "Shortlisted", icon: "heart-outline" },
  { id: "5", label: "Visitors", icon: "eye-outline" },
];

interface QuickActionsProps {
  onActionPress: (actionId: string) => void;
}

export default function QuickActions({ onActionPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.pill}
            activeOpacity={0.7}
            onPress={() => onActionPress(item.id)}
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={Colors.maroon || "#D32F2F"}
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    gap: 6,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
});
