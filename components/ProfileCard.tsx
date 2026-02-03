import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: any;
  bio?: string;
  matchPercentage?: number;
}

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <Image source={profile.image} style={styles.image} resizeMode="cover" />

      {/* Gradient Overlay for text readability */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* Card Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={styles.location}>{profile.location}</Text>
          </View>
          {profile.matchPercentage && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>
                {profile.matchPercentage}% Match
              </Text>
            </View>
          )}
        </View>

        {profile.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {profile.bio}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  location: {
    fontSize: 16,
    color: "#eee",
    fontWeight: "500",
  },
  matchBadge: {
    backgroundColor: Colors.light.gold, // Assuming gold is defined in Colors
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matchText: {
    color: Colors.light.maroon,
    fontWeight: "bold",
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    color: "#ddd",
    lineHeight: 20,
  },
});
