import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const DailyPanchang = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header / Date */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{today}</Text>
          <View style={styles.tithiContainer}>
            <Ionicons name="moon" size={14} color={Colors.light.gold} />
            <Text style={styles.tithiText}>Shukla Paksha, Tritiya</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons
                name="sunny-outline"
                size={18}
                color={Colors.light.maroon}
              />
              <View>
                <Text style={styles.label}>Sunrise</Text>
                <Text style={styles.value}>06:45 AM</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Ionicons
                name="moon-outline"
                size={18}
                color={Colors.light.maroon}
              />
              <View>
                <Text style={styles.label}>Sunset</Text>
                <Text style={styles.value}>06:15 PM</Text>
              </View>
            </View>
          </View>

          {/* Shubh Muhurat Highlight */}
          <View style={styles.muhuratContainer}>
            <Text style={styles.muhuratLabel}>✨ Shubh Muhurat Today</Text>
            <Text style={styles.muhuratTime}>10:30 AM - 12:15 PM</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  tithiContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tithiText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: "600",
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.gold,
    opacity: 0.3,
  },
  label: {
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.6,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  muhuratContainer: {
    backgroundColor: Colors.light.maroon,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  muhuratLabel: {
    fontSize: 12,
    color: Colors.light.ivory,
    fontWeight: "600",
    marginBottom: 2,
  },
  muhuratTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
});
