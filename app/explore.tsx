import { PeopleCard } from "@/components/people/PeopleCard";
import {
    PeopleFilterBar,
    PeopleFilterPanel,
} from "@/components/people/PeopleFilterBar";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ALL_PEOPLE = [
  {
    id: 1,
    name: "Riya Gupta",
    age: 24,
    distance: "2.5 km",
    matchScore: 88,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 2,
    name: "Ananya Singh",
    age: 25,
    distance: "3.1 km",
    matchScore: 85,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Meera Patel",
    age: 23,
    distance: "4.0 km",
    matchScore: 82,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 4,
    name: "Sanya Malhotra",
    age: 26,
    distance: "5.2 km",
    matchScore: 79,
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 5,
    name: "Priya Sharma",
    age: 27,
    distance: "1.2 km",
    matchScore: 92,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Neha Verma",
    age: 22,
    distance: "6.5 km",
    matchScore: 75,
    image: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 7,
    name: "Kavita Das",
    age: 28,
    distance: "8.0 km",
    matchScore: 70,
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 8,
    name: "Sneha Reddy",
    age: 25,
    distance: "12 km",
    matchScore: 68,
    image: "https://i.pravatar.cc/150?img=12",
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.maroon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore People</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={24} color={Colors.light.maroon} />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <PeopleFilterBar
        isExpanded={isFilterOpen}
        onExpand={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Filter Panel */}
      <View style={styles.panelWrapper}>
        <PeopleFilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>
          {ALL_PEOPLE.length} Profiles Found
        </Text>
        <View style={styles.grid}>
          {ALL_PEOPLE.map((person) => (
            <View key={person.id} style={styles.cardWrapper}>
              <PeopleCard {...person} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
    paddingTop: 50, // Status bar spacing
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  searchBtn: {
    padding: 5,
  },
  panelWrapper: {
    position: "absolute",
    top: 150, // Adjust based on header + filter bar
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  resultCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontWeight: "500",
  },
  grid: {
    gap: 10,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});
