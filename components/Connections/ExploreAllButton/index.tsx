import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ExploreAllButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/connections/explore-all" as any);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[Colors.maroon, "#A00028"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>Explore All Matches</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
