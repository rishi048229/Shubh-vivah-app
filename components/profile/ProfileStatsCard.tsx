import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

interface StatItem {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const ProfileStatsCard = () => {
  const { completionPercentage } = useProfile();

  const stats: StatItem[] = [
    {
      label: "Profile",
      value: completionPercentage,
      icon: "person-circle",
      color: Colors.light.gold,
    },
    { label: "Views", value: 127, icon: "eye", color: Colors.light.maroon },
    { label: "Interests", value: 24, icon: "heart", color: "#FF6B6B" },
    { label: "Matches", value: 8, icon: "sparkles", color: Colors.light.gold },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(400)}
      style={styles.container}
    >
      <Text style={styles.title}>Profile Insights</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <AnimatedStatItem key={stat.label} stat={stat} index={index} />
        ))}
      </View>
    </Animated.View>
  );
};

const AnimatedStatItem = ({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}) => {
  const animatedValue = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withDelay(
      index * 150,
      withTiming(stat.value, { duration: 1000 }),
    );
    progressWidth.value = withDelay(
      index * 150,
      withTiming(stat.value > 100 ? 100 : stat.value, { duration: 800 }),
    );
  }, [stat.value]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Ionicons name={stat.icon} size={18} color={stat.color} />
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
      <Text style={[styles.statValue, { color: stat.color }]}>
        {stat.value}
      </Text>
      <View style={styles.progressBg}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: stat.color },
            progressStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.maroon,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "47%",
    backgroundColor: Colors.light.ivory,
    borderRadius: 14,
    padding: 14,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBg: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
