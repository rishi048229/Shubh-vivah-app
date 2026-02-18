import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Image,
    Platform,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface GradientHeroProps {
  userName: string;
  userAvatar: string;
  contextText: string;
  location?: string;
  scrollY: SharedValue<number>;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onQuickActionPress?: (id: string) => void;
  onLocationPress?: () => void;
}

const HEADER_MAX_HEIGHT = 260; // Reduced to close gap after Search Bar removal
const HEADER_MIN_HEIGHT = 90; // Further reduced for very compact look
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function GradientHero({
  userName,
  userAvatar,
  contextText,
  location,
  scrollY,
  onAvatarPress,
  onNotificationPress,
  onSearchPress,
  onQuickActionPress,
  onLocationPress,
}: GradientHeroProps) {
  const insets = useSafeAreaInsets();

  // 1. Container Height Animation
  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height, paddingTop: insets.top + 5 }; // Reduced padding top slightly
  });

  // 2. Greeting Opacity & Translate (Fade out and move up)
  const greetingStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE / 2],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -20],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  // 3. Search Bar Translate (Move smoothly to sticky position)
  const searchStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -80], // Move up more to clear the way
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  // 4. Header Elements Animation (Avatar & Bell shrink)
  const headerElementsStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [1, 0.6], // Smaller scale
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, 2],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }, { translateY }] };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Ivory Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFFF0" }]} />

      {/* Top Row: Avatar & Notification */}
      <View style={styles.topRow}>
        <Animated.View style={headerElementsStyle}>
          <TouchableOpacity onPress={onAvatarPress}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={headerElementsStyle}>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#5C4033" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Main Text Content (Fades Out) */}
      <Animated.View style={[styles.contentContainer, greetingStyle]}>
        <Text style={styles.greeting}>
          Hello, <Text style={styles.userName}>{userName}</Text>
        </Text>
        <Text style={styles.contextText}>{contextText}</Text>

        <View style={styles.metaRow}>
          {location && (
            <TouchableOpacity onPress={onLocationPress}>
              <View style={styles.locationTag}>
                <Ionicons
                  name="location"
                  size={12}
                  color="#5C4033"
                  style={{ opacity: 0.9 }}
                />
                <Text style={styles.metaText}>{location}</Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.divider} />
          <Text style={styles.metaText}>Updated today</Text>
        </View>
      </Animated.View>

      {/* Sticky Search & Chips */}
      <Animated.View style={[searchStyle]}>
        {/* Chips Row - Moved up since Search Bar is gone */}
        <View style={styles.quickActionsRow}>
          <GlassChip
            icon="search-outline"
            label="Search"
            onPress={() => onQuickActionPress?.("search")}
          />
          <GlassChip
            icon="options-outline"
            label="Preferences"
            onPress={() => onQuickActionPress?.("preferences")}
          />
          <GlassChip
            icon="location-outline"
            label="Nearby"
            onPress={() => onQuickActionPress?.("nearby")}
          />
          <GlassChip
            icon="heart-outline"
            label="Shortlisted"
            onPress={() => onQuickActionPress?.("shortlisted")}
          />
        </View>
      </Animated.View>

      {/* Bottom Dissolving Fade */}
      <LinearGradient
        colors={["transparent", "#FFFFF0"]} // Fade to Ivory
        locations={[0, 1]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const GlassChip = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.chipWrapper}>
    <BlurView intensity={20} tint="light" style={styles.chipBlur}>
      <Ionicons name={icon} size={16} color="#800000" />
      <Text style={styles.chipText}>{label}</Text>
    </BlurView>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    zIndex: 10,
    overflow: "hidden", // Clip content when shrinking
    // Shadow moved to search bar only to avoid hard line
    shadowColor: "transparent",
    elevation: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0000",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  contentContainer: {
    marginBottom: 15, // Reduced for tighter sticky feel
    paddingHorizontal: 5,
  },
  greeting: {
    fontSize: 24,
    color: "#2D1406", // Darker text for light background
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-light",
    marginBottom: 2,
  },
  userName: {
    fontWeight: "700",
    color: "#800000",
  },
  contextText: {
    fontSize: 14,
    color: "#5C4033",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#5C4033",
    marginHorizontal: 10,
  },
  metaText: {
    fontSize: 12,
    color: "#5C4033",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    height: 44,
  },
  placeholderText: {
    marginLeft: 10,
    color: "#999",
    fontSize: 14,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  chipBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.4)", // Fallback / Base
  },
  chipText: {
    color: "#800000",
    fontSize: 11,
    fontWeight: "600",
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Increased for smoother blend
  },
});
