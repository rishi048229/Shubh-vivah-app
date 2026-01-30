import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const BestMatchHero = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(0.92, { duration: 1500 }); // 92% match
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * 18; // Radius 18
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={Colors.light.gold} />
        <Text style={styles.headerTitle}>Today's Best Match for You</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.contentRow}>
          {/* Profile Image with Match Ring */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=5" }}
              style={styles.image}
            />
            <View style={styles.scoreRingContainer}>
              <Svg width={44} height={44} viewBox="0 0 44 44">
                <Circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke={Colors.light.ivory}
                  strokeWidth="3"
                  strokeOpacity={0.3}
                />
                <AnimatedCircle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke={Colors.light.gold}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  animatedProps={animatedProps}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="22, 22"
                />
              </Svg>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>92%</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name}>Priya Sharma, 26</Text>
            <Text style={styles.location}>Mumbai, Maharashtra</Text>

            <View style={styles.reasons}>
              <ReasonChip icon="location-outline" label="Same City" />
              <ReasonChip icon="star-outline" label="Kundali Compatible" />
              <ReasonChip icon="heart-outline" label="Lifestyle Match" />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.viewProfileBtn}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortlistBtn}>
            <Ionicons
              name="heart-outline"
              size={20}
              color={Colors.light.maroon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const ReasonChip = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={10} color={Colors.light.maroon} />
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.maroon,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Glass-ish
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  contentRow: {
    flexDirection: "row",
    gap: 16,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  scoreRingContainer: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.maroon,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.light.ivory,
  },
  scoreTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  reasons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  chipText: {
    fontSize: 10,
    color: Colors.light.maroon,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: Colors.light.gold,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  shortlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
});
