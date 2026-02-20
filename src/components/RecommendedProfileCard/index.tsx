import { Colors } from "@/constants/Colors";
import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75; // 75% of screen width

interface RecommendedProfileCardProps {
  profile: MatchProfile;
  onWhyMatchPress: (profile: MatchProfile) => void;
  onLikePress?: (profile: MatchProfile) => void;
}

export default function RecommendedProfileCard({
  profile,
  onWhyMatchPress,
  onLikePress,
}: RecommendedProfileCardProps) {
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: profile.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Match Percentage Badge */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{profile.matchPercentage}% Match</Text>
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => onWhyMatchPress(profile)}
          >
            <Ionicons name="information-circle" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Name & Age Overlay */}
        <View style={styles.overlayContent}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.location}>
            {profile.profession} • {profile.city}
          </Text>
        </View>
      </View>

      {/* Details & Actions */}
      <View style={styles.detailsContainer}>
        {/* Match Reasons (Capsules) */}
        <View style={styles.capsuleContainer}>
          <View style={styles.capsule}>
            <Ionicons name="location-outline" size={12} color="#555" />
            <Text style={styles.capsuleText}>Nearby</Text>
          </View>
          <View style={styles.capsule}>
            <Ionicons name="school-outline" size={12} color="#555" />
            <Text style={styles.capsuleText}>{profile.education}</Text>
          </View>
          <View style={styles.capsule}>
            <Ionicons name="heart-outline" size={12} color="#555" />
            <Text style={styles.capsuleText}>Lifestyle Match</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons name="star-outline" size={24} color={Colors.maroon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={Colors.maroon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => onLikePress?.(profile)}
          >
            <Ionicons name="heart" size={24} color="#FFF" />
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
    marginRight: 15,
    marginBottom: 20, // Space for shadow
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    height: 280,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    position: "relative",
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
    height: 120,
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(194, 24, 7, 0.9)", // Maroon
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoIcon: {
    padding: 2,
  },
  overlayContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  location: {
    fontSize: 14,
    color: "#EEE",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  capsuleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  capsuleText: {
    fontSize: 11,
    color: "#444",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  likeButton: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
    shadowColor: Colors.maroon,
    shadowOpacity: 0.3,
    elevation: 4,
  },
});
