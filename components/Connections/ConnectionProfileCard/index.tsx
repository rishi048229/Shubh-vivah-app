import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
const ITEM_SPACING = 12;
const PAGE_PADDING = 20;
const CARD_WIDTH = (width - PAGE_PADDING * 2 - ITEM_SPACING) / 2;
const CARD_HEIGHT = 260;

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

  const handleConnect = () => {
    // Implement connect logic
    console.log("Connect with", profile.name);
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
        <ImageBackground
          source={{ uri: profile.imageUri }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Top Right Like Button */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => setLiked(!liked)}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "#FF4B4B" : "#FFF"}
            />
          </TouchableOpacity>

          {/* Bottom Content */}
          <View style={styles.bottomContainer}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.95)"]}
              style={styles.gradient}
            />
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {profile.name}
                  </Text>
                  {profile.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#2196F3"
                    />
                  )}
                </View>
                <Text style={styles.profession} numberOfLines={1}>
                  {profile.profession}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleConnect}
              >
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 0, // Handled by grid gap
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageStyle: {
    borderRadius: 20,
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  content: {
    gap: 10,
  },
  textContainer: {
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
  },
  profession: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  connectButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  connectText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  bottomContainer: {
    padding: 12,
    width: "100%",
    marginTop: "auto",
  },
});
