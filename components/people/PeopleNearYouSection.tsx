import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { PeopleCard } from "./PeopleCard";

const MOCK_PEOPLE = [
  {
    id: 1,
    name: "Riya Gupta",
    age: 24,
    distance: "2.5 km away",
    matchScore: 88,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 2,
    name: "Ananya Singh",
    age: 25,
    distance: "3.1 km away",
    matchScore: 85,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Meera Patel",
    age: 23,
    distance: "4.0 km away",
    matchScore: 82,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 4,
    name: "Sanya Malhotra",
    age: 26,
    distance: "5.2 km away",
    matchScore: 79,
    image: "https://i.pravatar.cc/150?img=3",
  },
];

import { useRouter } from "expo-router";
import { ExploreOverlay } from "./ExploreOverlay";
import { FullScreenMap } from "./FullScreenMap";

export const PeopleNearYouSection = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const handleMapToggle = () => {
    setIsMapOpen(true);
    setViewMode("map");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>People Near You</Text>
          <TouchableOpacity onPress={() => setIsExploreOpen(true)}>
            <Text style={styles.exploreLink}>Explore All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "map" && styles.activeToggleBtn,
            ]}
            onPress={handleMapToggle}
          >
            <Ionicons
              name="map-outline"
              size={16}
              color={viewMode === "map" ? Colors.light.maroon : "#888"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "list" && styles.activeToggleBtn,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={viewMode === "list" ? Colors.light.maroon : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Screen Map Modal */}
      <FullScreenMap visible={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* Explore Overlay Modal */}
      <ExploreOverlay
        visible={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
      />

      {/* List View (Always shown here, Map is a modal now) */}
      <Animated.View entering={FadeIn} style={styles.listContainer}>
        {MOCK_PEOPLE.map((person) => (
          <PeopleCard key={person.id} {...person} />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleRow: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  exploreLink: {
    fontSize: 12,
    color: Colors.light.gold,
    fontWeight: "600",
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeToggleBtn: {
    backgroundColor: Colors.light.gold,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: "#E6F4FE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  mapText: {
    marginTop: 10,
    color: "#666",
    fontWeight: "500",
  },
  mockPin: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pinImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  listContainer: {
    gap: 4,
  },
});
