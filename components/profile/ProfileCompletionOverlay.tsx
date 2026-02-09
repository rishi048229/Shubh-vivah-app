import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProfileCompletionOverlayProps {
  completionPercentage: number;
  isVisible: boolean;
}

export const ProfileCompletionOverlay = ({
  completionPercentage,
  isVisible,
}: ProfileCompletionOverlayProps) => {
  const router = useRouter();

  if (!isVisible) return null;

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - completionPercentage / 100);

  const handlePress = () => {
    router.push("/complete-profile/terms-conditions");
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={30} style={styles.blur} tint="light" />

      <View style={styles.card}>
        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={110} height={110} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={55}
              cy={55}
              r={radius}
              stroke={Colors.light.lightMaroon}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={55}
              cy={55}
              r={radius}
              stroke={Colors.light.gold}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="55, 55"
            />
          </Svg>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{completionPercentage}%</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Complete your profile to unlock matches and visibility
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Complete Profile</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.light.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    width: "100%",
    maxWidth: 340,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  svg: {
    transform: [{ rotate: "0deg" }],
  },
  percentageContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.maroon,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    gap: 8,
    width: "100%",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
});
