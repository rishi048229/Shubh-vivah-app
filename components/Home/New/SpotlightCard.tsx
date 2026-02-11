import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface SpotlightCardProps {
  profile: MatchProfile;
  onPress: () => void;
}

export default function SpotlightCard({
  profile,
  onPress,
}: SpotlightCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.headerTitle}>Today's Spotlight</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.cardContainer}
      >
        <ImageBackground
          source={{ uri: profile.imageUri }}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 16 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />
          <View style={styles.content}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Best Match</Text>
            </View>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={styles.city}>{profile.city}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  content: {
    padding: 16,
  },
  badge: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  city: {
    fontSize: 14,
    color: "#EEE",
  },
});
