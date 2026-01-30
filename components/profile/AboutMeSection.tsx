import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface AboutMeSectionProps {
  completionPercentage: number;
}

export const AboutMeSection = ({
  completionPercentage,
}: AboutMeSectionProps) => {
  if (completionPercentage < 80) return null;

  return (
    <Animated.View entering={FadeInUp} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Me</Text>
        <Ionicons name="pencil" size={18} color={Colors.light.maroon} />
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write a few lines that describe who you are..."
          placeholderTextColor="#999"
          defaultValue="I am a software engineer who loves traveling and reading. Looking for someone with similar interests."
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
});
