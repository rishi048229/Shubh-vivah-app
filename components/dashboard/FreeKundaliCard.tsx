import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

export const FreeKundaliCard = () => {
  const [hasKundali, setHasKundali] = useState(false); // Mock state
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      rotation: rotation.value,
    };
  });

  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <View style={styles.card}>
        {/* Decorative Background */}
        <View style={styles.bgDecoration}>
          <Svg height="300" width="300" viewBox="0 0 100 100">
            <AnimatedG origin="50, 50" animatedProps={animatedProps}>
              {/* Zodiac Ring Mock */}
              <Circle
                cx="50"
                cy="50"
                r="45"
                stroke={Colors.light.gold}
                strokeWidth="0.5"
                strokeOpacity="0.3"
                strokeDasharray="4, 2"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="35"
                stroke={Colors.light.gold}
                strokeWidth="0.2"
                strokeOpacity="0.2"
                fill="none"
              />
              {/* Planetary Symbols Positions (Abstract) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <Circle
                  key={i}
                  cx={50 + 45 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 45 * Math.sin((angle * Math.PI) / 180)}
                  r="1"
                  fill={Colors.light.gold}
                  opacity="0.6"
                />
              ))}
            </AnimatedG>
          </Svg>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="planet" size={20} color={Colors.light.maroon} />
          </View>
          <View>
            <Text style={styles.title}>Free Kundali & Horoscope</Text>
            <Text style={styles.subtitle}>
              Discover your cosmic path & compatibility
            </Text>
          </View>
        </View>

        {/* Dynamic Content */}
        <View style={styles.content}>
          {!hasKundali ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateTitle}>
                Create your Kundali in 2 mins
              </Text>
              <Text style={styles.stateDesc}>
                Accurate Vedic calculations based on your birth details.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setHasKundali(true)} // Toggle for demo
              >
                <Text style={styles.primaryBtnText}>Create Free Kundali</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.light.ivory}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <View style={styles.readyBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.light.green}
                />
                <Text style={styles.readyText}>Your Kundali is Ready</Text>
              </View>
              <View style={styles.tags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Non-Manglik</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Gana: Deva</Text>
                </View>
              </View>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>View Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Match Kundali</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Horoscope Insight Strip */}
          <View style={styles.insightStrip}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>Daily Horoscope</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.insightText}>
              "A favorable day for family discussions. Venus brings harmony to
              relationships."
            </Text>
          </View>

          {/* Matchmaking CTA */}
          <View style={styles.matchCta}>
            <View>
              <Text style={styles.matchCtaTitle}>Kundali Matchmaking</Text>
              <Text style={styles.matchCtaDesc}>
                Check 36 Gunas compatibility
              </Text>
            </View>
            <TouchableOpacity style={styles.matchBtn}>
              <Text style={styles.matchBtnText}>Check Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  bgDecoration: {
    position: "absolute",
    top: -50,
    right: -50,
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  content: {
    gap: 20,
  },
  stateContainer: {
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  stateDesc: {
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 18,
  },
  primaryBtn: {
    backgroundColor: Colors.light.maroon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    alignSelf: "flex-start",
  },
  primaryBtnText: {
    color: Colors.light.ivory,
    fontWeight: "bold",
    fontSize: 14,
  },
  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.green,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.light.maroon,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: Colors.light.maroon,
    fontWeight: "bold",
    fontSize: 14,
  },
  insightStrip: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gold,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  viewAll: {
    fontSize: 10,
    color: Colors.light.text,
    textDecorationLine: "underline",
  },
  insightText: {
    fontSize: 12,
    color: Colors.light.text,
    fontStyle: "italic",
    opacity: 0.9,
  },
  matchCta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.maroon,
    padding: 12,
    borderRadius: 10,
  },
  matchCtaTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
  matchCtaDesc: {
    fontSize: 10,
    color: Colors.light.ivory,
    opacity: 0.9,
  },
  matchBtn: {
    backgroundColor: Colors.light.gold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  matchBtnText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
