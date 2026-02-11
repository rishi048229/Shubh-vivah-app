import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    ImageBackground,
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

export const CARD_WIDTH = width * 0.75;
export const CARD_HEIGHT = 420;
export const SPACING = 12;

interface HeroMatchCardProps {
  profile: MatchProfile;
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
}

export default function HeroMatchCard({
  profile,
  index,
  scrollX,
  onPress,
}: HeroMatchCardProps) {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1.0, 0.9],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
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
        <ImageBackground
          source={{ uri: profile.imageUri }}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 24 }}
        >
          {/* Active Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
            style={styles.gradient}
          />

          {/* Content - Fades in/out based on active state could be added,
              but for now passing opacity to entire container handles mainly focus.
           */}
          <View style={styles.content}>
            {/* Match Insight Pill */}
            <View style={styles.matchBadge}>
              <Ionicons name="sparkles" size={12} color="#FFF" />
              <Text style={styles.matchText}>
                {profile.matchPercentage}% Match
              </Text>
            </View>

            {/* Name & Age */}
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>

            {/* Context */}
            <Text style={styles.context}>
              {profile.profession} • {profile.city}
            </Text>

            {/* Match Reasons (Text) */}
            <View style={styles.reasonsContainer}>
              {profile.matchReasons.slice(0, 2).map((reason, idx) => (
                <Text key={idx} style={styles.reasonText} numberOfLines={1}>
                  • {reason}
                </Text>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
              <Text style={styles.ctaText}>View Profile</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: SPACING,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 24,
    gap: 6,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D32F2F", // Primary Color
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  matchText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  context: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  reasonsContainer: {
    gap: 4,
    marginBottom: 16,
  },
  reasonText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
