import { MatchProfile } from "@/types/connections";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface QuickViewCardProps {
  profile: MatchProfile;
  onPress: () => void;
}

export default function QuickViewCard({
  profile,
  onPress,
}: QuickViewCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: profile.imageUri }}
        style={styles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        />

        {/* Match Badge - Mini */}
        <View style={styles.matchBadge}>
          <Sparkles size={10} color="#FFD700" />
          <Text style={styles.matchText}>{profile.matchPercentage}%</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.age}>
            {profile.age} • {profile.city.split(",")[0]}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150, // Slightly wider
    height: 200, // Taller
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  matchBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    padding: 12,
    paddingBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  age: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "400",
  },
});
