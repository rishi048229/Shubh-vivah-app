import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
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

const ITEM_WIDTH = width * 0.75;
const SPACING = 12;
export const SNAP_INTERVAL = ITEM_WIDTH + SPACING;

interface MatchCardProps {
  profile: MatchProfile;
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
  onAction?: (profile: MatchProfile) => void;
}

export default function MatchCard({
  profile,
  index,
  scrollX,
  onPress,
  onAction,
}: MatchCardProps) {
  const [liked, setLiked] = useState(false);
  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
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
        <ImageBackground
          source={{ uri: profile.imageUri }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Gradient Overlay for Text Readability */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.1)",
              "transparent",
              "rgba(0,0,0,0.6)",
              "rgba(0,0,0,0.9)",
            ]}
            style={styles.gradient}
          />

          {/* Header Section: Name & Connecting Status */}
          <View style={styles.header}>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.connectingStatus}>
              <ActivityIndicator
                size="small"
                color="#FFF"
                style={{ transform: [{ scale: 0.7 }] }}
              />
              <Text style={styles.connectingText}>Connecting</Text>
            </View>
          </View>

          {/* Footer Section: User Context & Actions */}
          <View style={styles.footer}>
            {/* Context: Avatar + Handle + Time */}
            <View style={styles.contextRow}>
              <Image
                source={{ uri: profile.imageUri }}
                style={styles.miniAvatar}
              />
              <View>
                <Text style={styles.handleText}>
                  @{profile.name.replace(/\s/g, "").toLowerCase()}
                </Text>
                <Text style={styles.timeText}>23m ago</Text>
              </View>
            </View>

            {/* Actions: Like & Connect+ */}
            <View style={styles.actionRow}>
              {/* Like Button */}
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => setLiked(!liked)}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? "#FF4B4B" : "#FFF"}
                />
              </TouchableOpacity>

              {/* Connect + Button */}
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => onAction?.(profile)}
              >
                <Ionicons name="add" size={20} color="#000" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    marginRight: SPACING,
    height: 450, // Increased height for better aspect ratio
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  imageStyle: {
    borderRadius: 30,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  connectingStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  connectingText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "500",
  },
  footer: {
    width: "100%",
    gap: 20,
  },
  contextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  handleText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)", // Glassy effect
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 6,
  },
  connectButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
