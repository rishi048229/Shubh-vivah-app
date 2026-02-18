import { Colors } from "@/constants/Colors";
import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const RADAR_SIZE = width - 40;

interface NearbyRadarSectionProps {
  profiles: MatchProfile[];
  onExplorePress: () => void;
  userLocation: string; // "City, Area"
}

export default function NearbyRadarSection({
  profiles,
  onExplorePress,
  userLocation,
}: NearbyRadarSectionProps) {
  // Radar Pulse Animation
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: 0 }), // Reset
      ),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBg}>
            <Ionicons name="earth" size={18} color={Colors.maroon} />
          </View>
          <View>
            <Text style={styles.title}>Discover Around You</Text>
            <Text style={styles.subtitle}>
              {profiles.length} profiles near {userLocation}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onExplorePress}>
          <Text style={styles.exploreText}>Explore</Text>
        </TouchableOpacity>
      </View>

      {/* Radar Map Visual */}
      <View style={styles.radarContainer}>
        {/* Background Grid/Circles */}
        <View style={styles.radarCircle1} />
        <View style={styles.radarCircle2} />
        <View style={styles.radarCircle3} />

        {/* Animating Pulse */}
        <Animated.View style={[styles.pulseCircle, pulseStyle]} />

        {/* Center: User */}
        <View style={styles.centerDot}>
          <Ionicons name="navigate" size={16} color="#FFF" />
        </View>

        {/* Profiles "Popping" on Radar */}
        {profiles.slice(0, 5).map((profile, index) => (
          <RadarBlip key={profile.id} profile={profile} index={index} />
        ))}
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={onExplorePress}>
        <LinearGradient
          colors={[Colors.maroon, "#800000"]}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>View All Nearby Matches</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const RadarBlip = ({
  profile,
  index,
}: {
  profile: MatchProfile;
  index: number;
}) => {
  // Randomize position slightly for "organic" look but keep it static per render
  // In real app, map lat/long to x/y. Here we mock it.
  const angle = index * (360 / 5) * (Math.PI / 180);
  const radius = 60 + index * 20; // Spread out
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(index * 300, withSpring(1, { damping: 12 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.blipContainer,
        { marginTop: y, marginLeft: x },
        animatedStyle,
      ]}
    >
      <Image source={{ uri: profile.imageUri }} style={styles.blipImage} />
      <View style={styles.blipBadge} />
    </Animated.View>
  );
};

function withSpring(toValue: number, config?: any): number {
  // Re-export or just confirm dependency if 'react-native-reanimated' exports it
  // Using 'withTiming' as fallback if uncertain, but usually available.
  // For this snippet, assuming standard reanimated import works.
  return require("react-native-reanimated").withSpring(toValue, config);
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2D1406",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  exploreText: {
    color: Colors.maroon,
    fontWeight: "600",
    fontSize: 13,
  },
  // Radar UI
  radarContainer: {
    height: 300,
    backgroundColor: "#F0F4F8", // Light tech blue-grey
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  radarCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
  },
  radarCircle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
  },
  radarCircle3: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
  },
  pulseCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(128,0,0,0.1)",
  },
  centerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.maroon,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  // Blip
  blipContainer: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  blipImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  blipBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  // CTA
  ctaButton: {
    marginTop: -20, // Overlap radar
    alignSelf: "center",
    width: "80%",
  },
  ctaGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
