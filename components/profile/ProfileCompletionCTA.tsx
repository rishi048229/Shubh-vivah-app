import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCompletionCTAProps {
  completionPercentage: number;
  onPress: () => void;
}

export const ProfileCompletionCTA = ({
  completionPercentage,
  onPress,
}: ProfileCompletionCTAProps) => {
  if (completionPercentage >= 100) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Get better matches by adding more details about yourself.
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{completionPercentage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Complete Profile</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.light.gold} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.ivory,
    marginHorizontal: 20,
    marginTop: -20, // Overlap with hero
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.light.gold,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  button: {
    backgroundColor: Colors.light.maroon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: Colors.light.gold,
    fontWeight: "bold",
    fontSize: 14,
  },
});
