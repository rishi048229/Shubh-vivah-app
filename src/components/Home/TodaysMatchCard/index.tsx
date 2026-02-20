import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7; // ~70% width for carousel effect

interface TodaysMatchCardProps {
  name: string;
  age: string;
  location: string;
  matchPercentage: string;
  tags: string[];
  imageUri: string;
  style?: ViewStyle; // Added for flexible width in Grid
}

export default function TodaysMatchCard({
  name,
  age,
  location,
  matchPercentage,
  tags,
  imageUri,
  style,
}: TodaysMatchCardProps) {
  const router = useRouter();

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>
          {name}, {age}
        </Text>
        <Text style={styles.location}>{location}</Text>

        {/* Tags Row */}
        <View style={styles.tagsRow}>
          <LinearGradient
            colors={["#FF6B6B", "#D32F2F"]} // Gradient Red
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.matchTag}
          >
            <Text style={styles.matchText}>{matchPercentage} Match</Text>
          </LinearGradient>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Action Row */}
        <View style={styles.actionsRow}>
          <View style={styles.iconActions}>
            <TouchableOpacity>
              <Ionicons name="heart" size={24} color="#D32F2F" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#555"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="star-outline" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* View Profile Button */}
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() =>
            router.push({
              pathname: "/profile/[id]" as const,
              params: { id: "1" }, // Using static "1" for now as per previous fix
            })
          }
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF8E7", // Cream
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EBD8B2",
    marginRight: 15,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    width: "100%",
    height: 180, // Reduced height for better proportion in grid
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    marginBottom: 5,
  },
  name: {
    fontSize: 16, // Slightly smaller
    fontWeight: "bold",
    color: "#000",
  },
  location: {
    fontSize: 11,
    color: "#666",
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  matchTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  tag: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EBD8B2",
  },
  tagText: {
    fontSize: 9,
    color: "#333",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconActions: {
    flexDirection: "row",
    gap: 12,
  },
  viewProfileButton: {
    backgroundColor: "#C21807",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  viewProfileText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
