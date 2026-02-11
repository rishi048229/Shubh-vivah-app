import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCompletionProps {
  percentage: number;
  missingFields: string[];
}

export default function ProfileCompletion({
  percentage,
  missingFields,
}: ProfileCompletionProps) {
  if (percentage >= 100) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{percentage}%</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Add {missingFields[0]} to get more matches
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="arrow-forward" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar Background */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 40, // Bottom spacing for page end
    backgroundColor: "#FFF8F8", // Very light red tint
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D32F2F",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    padding: 8,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#EEE",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#D32F2F",
    borderRadius: 2,
  },
});
