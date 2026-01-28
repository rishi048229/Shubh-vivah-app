import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ACTIVITIES = [
  {
    id: 1,
    label: "Messages",
    count: 3,
    icon: "chatbubble-ellipses-outline",
    color: "#4CAF50",
  },
  { id: 2, label: "Views", count: 12, icon: "eye-outline", color: "#2196F3" },
  {
    id: 3,
    label: "Interests",
    count: 5,
    icon: "heart-outline",
    color: "#E91E63",
  },
  {
    id: 4,
    label: "Shortlisted",
    count: 8,
    icon: "bookmark-outline",
    color: "#FF9800",
  },
];

export const ActivitySummary = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {ACTIVITIES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.item}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View>
              <Text style={styles.count}>{item.count}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    backgroundColor: Colors.light.ivory,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  label: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
  },
});
