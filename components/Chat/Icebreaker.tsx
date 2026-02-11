import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IcebreakerSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={Colors.maroon} />
        <Text style={styles.title}>Start a Conversation</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <TouchableOpacity style={styles.card}>
          <Text style={styles.question}>
            "What's your favorite travel memory?"
          </Text>
          <Ionicons
            name="send"
            size={14}
            color={Colors.maroon}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.question}>"Coffee or Tea person?"</Text>
          <Ionicons
            name="send"
            size={14}
            color={Colors.maroon}
            style={styles.icon}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Add imports for ScrollView above if needed, but here it is implicit or I should import it.
// Added ScrollView to imports.

import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#FFF8F0", // Very light orange/cream
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0E6D2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D1406",
  },
  scroll: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  question: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
  },
  icon: {
    opacity: 0.8,
  },
});
