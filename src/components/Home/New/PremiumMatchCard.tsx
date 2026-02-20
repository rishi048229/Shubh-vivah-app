import { MatchProfile } from "@/types/connections";
import { LinearGradient } from "expo-linear-gradient";
import {
    Hand,
    Sparkles
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export const CARD_WIDTH = width * 0.85; // Slightly wider for premium look
export const CARD_HEIGHT = 640;
export const SPACING = 12;

interface PremiumMatchCardProps {
  profile: MatchProfile;
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
}

export default function PremiumMatchCard({
  profile,
  index,
  scrollX,
  onPress,
}: PremiumMatchCardProps) {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.92],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.cardContainer}
      >
        {/* Section A - Image Layer (Top 65%) */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: profile.imageUri }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          />

          {/* Top Controls / Match % */}
          <View style={styles.topControls}>
            <View style={styles.matchBadge}>
              <Sparkles size={12} color="#FFF" />
              <Text style={styles.matchText}>
                {profile.matchPercentage}% Match
              </Text>
            </View>
          </View>
        </View>

        {/* Section B - Info Sheet (Bottom 35%) */}
        <View style={styles.infoSheet}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{profile.name}</Text>
              <View style={styles.secondaryRow}>
                <Text style={styles.secondaryText}>
                  {profile.age} • {profile.city}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {profile.bio ||
              "Looking for a partner to share life's journey with."}
          </Text>

          <View style={styles.chipsContainer}>
            {profile.matchReasons.slice(0, 3).map((reason, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{reason}</Text>
              </View>
            ))}
            {profile.profession && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{profile.profession}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Floating CTA Button (Bottom Right) */}
        <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
          <Hand size={24} color="#111" strokeWidth={2.5} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: SPACING,
    // Layered shadow for modern SaaS feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  // Section A
  imageContainer: {
    height: "65%",
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    zIndex: 2,
  },
  topControls: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 3,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  matchText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  // Section B
  infoSheet: {
    height: "35%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    gap: 16,
    position: "absolute", // Technically visually simple flex col, but user req absolute logic or stacked feel
    bottom: 0,
    zIndex: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111111",
    lineHeight: 26,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  secondaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
  },
  description: {
    fontSize: 15,
    fontWeight: "400",
    color: "#374151",
    lineHeight: 24,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  // Floating CTA
  ctaButton: {
    position: "absolute",
    bottom: 24,
    right: 24, // Original right
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FACC15", // Gold tone
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Topmost
    shadowColor: "#FACC15",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
