import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NewMatchCardProps {
  name: string;
  age: string;
  job: string;
  location: string;
  imageUri: string;
}

export default function NewMatchCard({
  name,
  age,
  job,
  location,
  imageUri,
}: NewMatchCardProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Left Image */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Right Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {name} , {age}
          </Text>
        </View>

        <Text style={styles.jobText}>{job}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#C21807" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Action Icons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity>
            <Ionicons name="heart" size={22} color="#D32F2F" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#D32F2F"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="star-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        {/* View Profile Button - Specific to New Matches */}
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() =>
            router.push({
              pathname: "/profile/[id]" as const,
              params: { id: "1" },
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
    flexDirection: "row",
    backgroundColor: "#FFFFF0", // Ivory/Cream background
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0E6D2", // Subtle border
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    height: 180, // Increased height to fit button
  },
  image: {
    width: 120,
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#051960", // Dark Blue
  },
  jobText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    color: "#333",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 8,
  },
  viewProfileButton: {
    backgroundColor: "#C21807", // Red
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  viewProfileText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
