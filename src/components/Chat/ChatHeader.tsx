import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Your conversations</Text>
      </View>
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name="search" size={24} color={Colors.maroon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.ivory,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1406",
  },
  subtitle: {
    fontSize: 14,
    color: "#8B4513",
    marginTop: 2,
  },
  searchButton: {
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
