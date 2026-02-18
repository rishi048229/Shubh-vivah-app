import { Colors } from "@/constants/Colors";
import * as matchService from "@/services/matchService";
import { MatchProfile } from "@/types/connections";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CheckCircle2, Heart, Star, UserPlus } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
// Grid layout: 2 columns with spacing
// Card width is roughly (screen width - padding) / 2
const CARD_WIDTH = (width - 48) / 2;

interface ConnectionProfileCardProps {
  profile: MatchProfile;
  index?: number;
  onQuickView?: (profile: MatchProfile) => void;
}

export default function ConnectionProfileCard({
  profile,
  index = 0,
  onQuickView,
}: ConnectionProfileCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  const handleConnect = async () => {
    try {
      await matchService.sendRequest(parseInt(profile.id));
    } catch (e) {
      console.log(e);
    }
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      await matchService.likeUser(parseInt(profile.id));
    } catch (e) {
      console.log(e);
      setLiked(!liked);
    }
  };

  const handleShortlist = async () => {
    try {
      setShortlisted(!shortlisted);
      await matchService.shortlistUser(parseInt(profile.id));
    } catch (e) {
      console.log(e);
      setShortlisted(!shortlisted);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 500,
        delay: index * 100,
      }}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onQuickView?.(profile)}
        style={styles.card}
      >
        {/* Image Section (Square Aspect Ratio) */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: profile.imageUri }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)"]}
              style={styles.gradient}
            />

            {/* Top Right Action Buttons - Overlaid */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShortlist}
              >
                <Star
                  size={14}
                  color={shortlisted ? "#FFC107" : "#FFF"}
                  fill={shortlisted ? "#FFC107" : "transparent"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
                <Heart
                  size={14}
                  color={liked ? "#FF4B4B" : "#FFF"}
                  fill={liked ? "#FF4B4B" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Info Content */}
        <View style={styles.infoContent}>
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {profile.name}
              </Text>
              {profile.verified && (
                <CheckCircle2
                  size={16}
                  color="#2196F3"
                  fill="#E3F2FD"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>

            <Text style={styles.subText} numberOfLines={1}>
              {profile.age} • {profile.city}
            </Text>

            {/* Optional: Profession if space permits, or omit for cleaner look */}
            {/* <Text style={styles.profession} numberOfLines={1}>
              {profile.profession}
            </Text> */}
          </View>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
          >
            <UserPlus size={16} color="#FFF" />
            <Text style={styles.connectText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 0,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    height: "auto", // Let content determine height
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Force square
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    // No specific border radius here strictly needed if parent overflows hidden,
    // but safe to keep
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtons: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "column",
    gap: 8,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  infoContent: {
    padding: 12,
    gap: 8,
  },
  textContainer: {
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    flexShrink: 1,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  profession: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  connectButton: {
    backgroundColor: Colors.maroon,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
  },
  connectText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFF",
  },
});
