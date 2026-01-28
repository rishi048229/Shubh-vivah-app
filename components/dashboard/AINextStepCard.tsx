import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const AINextStepCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="bulb" size={24} color={Colors.light.ivory} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>AI Recommendation</Text>
          <Text style={styles.description}>
            Based on your activity, we recommend you message{" "}
            <Text style={styles.highlight}>Priya (91% match)</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble" size={16} color={Colors.light.maroon} />
        </TouchableOpacity>
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
    backgroundColor: Colors.light.maroon,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: Colors.light.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 10,
    color: Colors.light.gold,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: Colors.light.ivory,
    lineHeight: 16,
  },
  highlight: {
    fontWeight: "bold",
    color: Colors.light.gold,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});
