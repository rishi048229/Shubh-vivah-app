import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProfileCompletionHero = () => {
  const completion = 0.65; // 65%
  const radius = 30;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(completion, { duration: 1500 });
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Svg width={70} height={70} viewBox="0 0 70 70">
              <Circle
                cx="35"
                cy="35"
                r={radius}
                stroke={Colors.light.gold}
                strokeWidth={strokeWidth}
                strokeOpacity={0.2}
                fill="none"
              />
              <AnimatedCircle
                cx="35"
                cy="35"
                r={radius}
                stroke={Colors.light.gold}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                strokeLinecap="round"
                fill="none"
                rotation="-90"
                origin="35, 35"
              />
            </Svg>
            <Text style={styles.percentageText}>
              {Math.round(completion * 100)}%
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Get 3x more matches by adding details
            </Text>
          </View>
        </View>

        <View style={styles.checklist}>
          <ChecklistItem label="Upload Horoscope" checked={true} />
          <ChecklistItem label="Add Family Details" checked={false} />
          <ChecklistItem label="Verify Phone Number" checked={true} />
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Complete Profile</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.light.ivory} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChecklistItem = ({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) => (
  <View style={styles.checklistItem}>
    <Ionicons
      name={checked ? "checkmark-circle" : "ellipse-outline"}
      size={16}
      color={checked ? Colors.light.green : Colors.light.text}
    />
    <Text style={[styles.checklistLabel, checked && styles.checkedLabel]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  checklist: {
    marginBottom: 16,
    gap: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checklistLabel: {
    fontSize: 13,
    color: Colors.light.text,
  },
  checkedLabel: {
    opacity: 0.6,
    textDecorationLine: "line-through",
  },
  ctaButton: {
    backgroundColor: Colors.light.maroon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  ctaText: {
    color: Colors.light.ivory,
    fontWeight: "bold",
    fontSize: 14,
  },
});
