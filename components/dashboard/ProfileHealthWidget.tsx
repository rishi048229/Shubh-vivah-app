import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ProfileHealthWidget = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Health</Text>
          <Text style={styles.score}>78/100</Text>
        </View>

        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: "78%" }]} />
        </View>

        <Text style={styles.tip}>💡 Tip: Add 2 more photos to reach 85%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  score: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.green,
  },
  barContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: Colors.light.green,
    borderRadius: 4,
  },
  tip: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontStyle: "italic",
  },
});
