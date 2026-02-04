import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProfileHeroProps {
  name: string;
  location: string;
  image: string;
  completionPercentage: number;
  stats: {
    shortlisted: number;
    views: number;
    messages: number;
  };
}

export const ProfileHero = ({
  name,
  location,
  image,
  completionPercentage,
  stats,
}: ProfileHeroProps) => {
  const progress = useSharedValue(0);
  const radius = 60;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(completionPercentage / 100, { duration: 1500 });
  }, [completionPercentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2C2C2C", "#1A1A1A"]}
        style={styles.background}
      />

      {/* Header Actions */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={Colors.light.gold}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.light.gold}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Image & Ring */}
      <View style={styles.profileContainer}>
        <View style={styles.svgContainer}>
          <Svg width={radius * 2 + 20} height={radius * 2 + 20}>
            {/* Background Circle */}
            <Circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke="rgba(255, 215, 0, 0.2)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke={Colors.light.gold}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${radius + 10}, ${radius + 10}`}
            />
          </Svg>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        </View>

        {completionPercentage < 80 && (
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>
              {completionPercentage}% Complete
            </Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.shortlisted}</Text>
          <Text style={styles.statLabel}>Shortlisted</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.views}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.messages}</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60, // Safe area adjustment
    marginBottom: 10,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  svgContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "absolute",
    width: 108,
    height: 108,
    borderRadius: 54,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  completionBadge: {
    position: "absolute",
    bottom: -10,
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.gold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    height: "80%",
  },
});
