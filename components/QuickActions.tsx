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

const ACTIONS = [
  { id: 1, label: "Matches", icon: "heart" },
  { id: 2, label: "Kundali", icon: "star" },
  { id: 3, label: "Chat", icon: "chatbubbles" },
  { id: 4, label: "Shortlist", icon: "bookmark" },
  { id: 5, label: "Search", icon: "search" },
  { id: 6, label: "Premium", icon: "diamond" },
];

export const QuickActions = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ACTIONS.map((action) => (
          <TouchableOpacity key={action.id} style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={action.icon as any}
                size={24}
                color={Colors.light.maroon}
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  actionItem: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: "500",
  },
});
