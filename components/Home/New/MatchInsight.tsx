import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MatchInsightProps {
  insights: string[]; // e.g. ["Based on your age preference", "Highly compatible education"]
}

export default function MatchInsight({ insights }: MatchInsightProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.titleRow}>
          <Ionicons name="bulb-outline" size={18} color="#FFD700" />
          <Text style={styles.title}>Why these matches?</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#666"
        />
      </TouchableOpacity>

      {expanded && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.content}
        >
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    marginTop: 12,
    gap: 8,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightText: {
    fontSize: 13,
    color: "#555",
  },
});
