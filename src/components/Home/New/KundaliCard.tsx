import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function KundaliCard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="planet" size={24} color="#5D4037" />
        </View>
        <View>
          <Text style={styles.title}>Free Kundali & Horoscope</Text>
          <Text style={styles.subtitle}>
            Discover your cosmic path & compatibility
          </Text>
        </View>
      </View>

      {/* Kundali Ready Section */}
      <View style={styles.section}>
        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.statusText}>Your Kundali is Ready</Text>
        </View>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Non-Manglik</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Gana: Deva</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>View Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton}>
            <Text style={styles.filledButtonText}>Match Kundali</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Horoscope */}
      <View style={styles.horoscopeBox}>
        <View style={styles.horoscopeHeader}>
          <Text style={styles.horoscopeTitle}>Daily Horoscope</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.horoscopeText}>
          "A favorable day for family discussions. Venus brings harmony to
          relationships."
        </Text>
      </View>

      {/* Matchmaking Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Kundali Matchmaking</Text>
          <Text style={styles.bannerSubtitle}>
            Check 36 Gunas compatibility
          </Text>
        </View>
        <TouchableOpacity style={styles.checkNowButton}>
          <Text style={styles.checkNowText}>Check Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFFBEA", // Cream/Yellow tint
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0E6D2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD54F", // Yellow
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4E342E", // Dark Brown
  },
  subtitle: {
    fontSize: 12,
    color: "#795548",
  },
  section: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32", // Green
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#EEE8DC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#5D4037",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#4E342E",
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#4E342E",
    fontWeight: "bold",
    fontSize: 14,
  },
  filledButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#8D1919", // Deep Red/Maroon
    alignItems: "center",
  },
  filledButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  horoscopeBox: {
    backgroundColor: "#FFF8E1", // Lighter yellow
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  horoscopeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  horoscopeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5D4037",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5D4037",
    textDecorationLine: "underline",
  },
  horoscopeText: {
    fontSize: 13,
    color: "#4E342E",
    fontStyle: "italic",
    lineHeight: 20,
  },
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6D1B1B", // Dark Maroon
    borderRadius: 16,
    padding: 15,
  },
  bannerTitle: {
    color: "#FFD54F",
    fontWeight: "bold",
    fontSize: 14,
  },
  bannerSubtitle: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 2,
  },
  checkNowButton: {
    backgroundColor: "#FFD54F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkNowText: {
    color: "#4E342E",
    fontWeight: "bold",
    fontSize: 12,
  },
});
