import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Profile } from "./types";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Background Image */}
      <Image
        source={{ uri: profile.image }}
        style={styles.image}
        contentFit="cover"
        transition={500}
      />

      {/* Overlay Gradient for Text Readability */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* Glassmorphism Content Overlay */}
      <View style={styles.infoContainer}>
        <BlurView intensity={80} tint="dark" style={styles.glassContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.location}>
                <Ionicons
                  name="location-sharp"
                  size={14}
                  color={Colors.light.ivory}
                />{" "}
                {profile.location}
              </Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>
                {profile.matchPercentage}% Match
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <Text style={styles.profession} numberOfLines={1}>
              <Ionicons name="briefcase" size={14} color={Colors.light.gold} />{" "}
              {profile.profession}
            </Text>
            {profile.isKundaliMatched && (
              <View style={styles.kundaliBadge}>
                <Text style={styles.kundaliText}>Kundali Matched</Text>
              </View>
            )}
          </View>
        </BlurView>
      </View>

      {/* Premium Glow Border (Optional illustration of premium status) */}
      {profile.isPremium && (
        <View style={styles.premiumBorder} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  glassContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.ivory,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 4,
  },
  matchBadge: {
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: Colors.light.maroon,
    fontWeight: "800",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profession: {
    fontSize: 14,
    color: "#eee",
    flex: 1,
    marginRight: 8,
  },
  kundaliBadge: {
    backgroundColor: "rgba(128, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  kundaliText: {
    color: Colors.light.gold,
    fontSize: 10,
    fontWeight: "600",
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.light.gold,
  },
});
