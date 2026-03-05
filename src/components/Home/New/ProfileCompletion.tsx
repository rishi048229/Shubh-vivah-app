import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ProfileCompletionProps {
  percentage: number;
  missingFields: string[];
  onPress?: () => void;
}

export default function ProfileCompletion({
  percentage,
  missingFields,
  onPress,
}: ProfileCompletionProps) {
  if (percentage >= 100) return null;

  // Animated progress bar
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(percentage, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 30) return "#E53935";
    if (percentage < 60) return "#FB8C00";
    if (percentage < 80) return "#FDD835";
    return "#43A047";
  };

  const color = getColor();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.progressCircle, { borderColor: color }]}>
          <Text style={[styles.progressText, { color }]}>{percentage}%</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            {missingFields.length > 0
              ? `Add ${missingFields[0]} to get more matches`
              : "Your profile is almost complete!"}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Ionicons name="arrow-forward" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* Animated Progress Bar */}
      <View style={styles.progressBarBg}>
        <Animated.View
          style={[styles.progressBarFill, { backgroundColor: color }, progressStyle]}
        />
      </View>

      {/* Missing fields hint */}
      {missingFields.length > 1 && (
        <Text style={styles.hint}>
          {missingFields.length} fields remaining
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#FFF8F8",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  button: {
    padding: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  hint: {
    fontSize: 11,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
