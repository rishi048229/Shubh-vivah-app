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
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

interface BestMatchCardProps {
  profile: MatchProfile;
  onPress: () => void;
  isActive: boolean; // To trigger "pop" or highlight
}

export default function BestMatchCard({
  profile,
  onPress,
  isActive,
}: BestMatchCardProps) {
  // Ring Rotation Animation
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      {/* Top Section: Profile & Info */}
      <View style={styles.topSection}>
        {/* Left: Animated Profile Ring */}
        <View style={styles.imageContainer}>
          <Animated.View style={[styles.ringContainer, ringStyle]}>
            <LinearGradient
              colors={[Colors.gold, "transparent", Colors.maroon]}
              style={styles.ringGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          <Image
            source={{ uri: profile.imageUri }}
            style={styles.profileImage}
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{profile.matchPercentage}%</Text>
          </View>
        </View>

        {/* Right/Center: Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.subText} numberOfLines={1}>
            {profile.location}
          </Text>

          {/* "Why This Match" Pills */}
          <View style={styles.pillsContainer}>
            {profile.matchReasons.slice(0, 2).map((reason, index) => (
              <View key={index} style={styles.pill}>
                <Text style={styles.pillText}>{reason}</Text>
              </View>
            ))}
          </View>

          {/* Animated View Profile Button with Running Border */}
          <TouchableOpacity onPress={onPress}>
            <LinearGradient
              colors={[Colors.gold, Colors.maroon, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.viewBtnBorder}
            >
              <View style={styles.viewBtnInner}>
                <Text style={styles.viewBtnText}>View Profile</Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={Colors.maroon}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 15,
    marginHorizontal: 10,
    // Enhanced Card Shadow "Golden Glow"
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)", // Subtle gold border
  },
  activeContainer: {
    borderColor: Colors.gold,
    borderWidth: 1.5,
    backgroundColor: "#FFFAF0", // Very light floral white when active
  },
  topSection: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center", // Center vertically
    width: "100%", // ensure full width
  },
  // Ring Styles
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  ringContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  ringGradient: {
    flex: 1,
    opacity: 0.8,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  matchBadge: {
    position: "absolute",
    bottom: -5,
    backgroundColor: Colors.maroon,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  matchText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Info Styles
  infoContainer: {
    flex: 1, // fill remaining space
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  pill: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
  },
  pillText: {
    fontSize: 10,
    color: Colors.maroon,
    fontWeight: "600",
  },
  // View Profile Button
  viewBtnBorder: {
    borderRadius: 18,
    padding: 1, // thinner border
    alignSelf: "flex-start",
  },
  viewBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 17,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 4,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.maroon,
  },
});
