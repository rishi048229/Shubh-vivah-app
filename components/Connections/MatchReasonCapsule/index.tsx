import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface MatchReasonCapsuleProps {
  reason: string;
  variant?: "location" | "age" | "education" | "lifestyle";
}

const getIconForReason = (reason: string): keyof typeof Ionicons.glyphMap => {
  if (
    reason.toLowerCase().includes("city") ||
    reason.toLowerCase().includes("state")
  ) {
    return "location";
  }
  if (reason.toLowerCase().includes("age")) {
    return "calendar";
  }
  if (reason.toLowerCase().includes("education")) {
    return "school";
  }
  if (
    reason.toLowerCase().includes("lifestyle") ||
    reason.toLowerCase().includes("values")
  ) {
    return "heart";
  }
  if (reason.toLowerCase().includes("profession")) {
    return "briefcase";
  }
  if (reason.toLowerCase().includes("manglik")) {
    return "star";
  }
  return "checkmark-circle";
};

const getColorForReason = (reason: string): string => {
  if (
    reason.toLowerCase().includes("city") ||
    reason.toLowerCase().includes("state")
  ) {
    return "#4CAF50";
  }
  if (reason.toLowerCase().includes("age")) {
    return "#2196F3";
  }
  if (reason.toLowerCase().includes("education")) {
    return "#FF9800";
  }
  return Colors.maroon;
};

export default function MatchReasonCapsule({
  reason,
  variant,
}: MatchReasonCapsuleProps) {
  const iconName = getIconForReason(reason);
  const color = getColorForReason(reason);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300 }}
      style={[styles.capsule, { borderColor: color }]}
    >
      <Ionicons name={iconName} size={12} color={color} />
      <Text style={[styles.text, { color }]}>{reason}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFF",
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
