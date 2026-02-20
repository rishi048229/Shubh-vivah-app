import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
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

interface CollapsibleHeroProps {
  userName: string;
  userAvatar: string; // URL
  contextText: string;
  location?: string;
  scrollY: SharedValue<number>;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onPrimaryAction?: () => void; // e.g., "See Matches"
  onSecondaryAction?: () => void; // e.g., "Edit Preferences"
  onLocationPress?: () => void;
}

const EXPANDED_HEIGHT = 320;
const COLLAPSED_HEIGHT = 120;
const SCROLL_RANGE = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

export default function CollapsibleHero({
  userName,
  userAvatar,
  contextText,
  location,
  scrollY,
  onAvatarPress,
  onNotificationPress,
  onPrimaryAction,
  onSecondaryAction,
  onLocationPress,
}: CollapsibleHeroProps) {
  const insets = useSafeAreaInsets();

  // 1. Container Height & Border Radius
  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
      Extrapolation.CLAMP,
    );

    // Side margins: Always 0 for full width
    const marginHorizontal = 0;

    // Top margin: Always 0
    const marginTop = 0;

    // Animate border radius: 32px -> 0px (Square off when collapsed)
    const borderBottomRadius = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [32, 0],
      Extrapolation.CLAMP,
    );

    return {
      height,
      borderBottomLeftRadius: borderBottomRadius,
      borderBottomRightRadius: borderBottomRadius,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginHorizontal,
      marginTop,
      paddingTop: insets.top + 10,
    };
  });

  // 2. Expanded Content (Fade Out)
  const expandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE / 2],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, -20],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  // 3. Collapsed Content (Fade In)
  const collapsedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_RANGE / 1.5, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background Gradient: Deep Maroon -> Rose */}
      <LinearGradient
        colors={[Colors.maroon, "#B22222"]} // Deep Maroon to Firebrick/Rose tone
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Radial Glow (Top Right) */}
      <View style={styles.glowDecoration} />

      {/* Header Row (Always Visible) */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarBtn}>
          {/* Placeholder for Avatar Image if needed, or just keep it minimal */}
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
        </TouchableOpacity>

        {/* Collapsed Title (Visible only when scrolled up) */}
        <Animated.View
          style={[styles.collapsedTitleContainer, collapsedContentStyle]}
        >
          <Text style={styles.collapsedTitle}>Hello, {userName}</Text>
        </Animated.View>

        <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn}>
          <Ionicons name="notifications" size={20} color="#FFF" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Expanded Content */}
      <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        <Text style={styles.context}>{contextText}</Text>

        {location && (
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={onLocationPress}
            disabled={!onLocationPress}
          >
            <Ionicons
              name="location-sharp"
              size={14}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.locationText}>{location} • Updated today</Text>
          </TouchableOpacity>
        )}

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onPrimaryAction}>
            <Text style={styles.primaryBtnText}>Discover Matches</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.maroon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onSecondaryAction}
          >
            <Text style={styles.secondaryBtnText}>Preferences</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
  },
  glowDecoration: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ scaleX: 1.5 }],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 20,
  },
  avatarBtn: {
    padding: 4,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFD700", // Gold
  },
  collapsedTitleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  collapsedTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  expandedContent: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  context: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "500",
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: Colors.maroon,
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  secondaryBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
