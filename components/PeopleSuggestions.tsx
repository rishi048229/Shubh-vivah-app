import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const MOCK_PEOPLE = [
  {
    id: 1,
    name: "Ananya",
    age: 24,
    location: "Mumbai",
    match: 95,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Rohan",
    age: 27,
    location: "Delhi",
    match: 88,
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 3,
    name: "Priya",
    age: 25,
    location: "Bangalore",
    match: 92,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 4,
    name: "Vikram",
    age: 29,
    location: "Pune",
    match: 85,
    image: "https://i.pravatar.cc/150?img=11",
  },
];

export const PeopleSuggestions: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterHeight = useSharedValue(0);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    filterHeight.value = withTiming(isFilterOpen ? 0 : 150);
  };

  const filterStyle = useAnimatedStyle(() => {
    return {
      height: filterHeight.value,
      opacity: filterHeight.value > 0 ? 1 : 0,
      overflow: "hidden",
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>People You May Like</Text>
        <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
          <Ionicons
            name="options-outline"
            size={20}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.filterPanel, filterStyle]}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity style={styles.filterChip}>
            <Text>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text>Age</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text>Profession</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_PEOPLE.map((person, index) => (
          <Animated.View
            key={person.id}
            entering={FadeInRight.delay(index * 100).duration(500)}
            style={styles.card}
          >
            <Image source={{ uri: person.image }} style={styles.profileImage} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>
                {person.name}, {person.age}
              </Text>
              <Text style={styles.location}>{person.location}</Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{person.match}% Match</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  filterButton: {
    padding: 8,
    backgroundColor: Colors.light.glassBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  filterPanel: {
    paddingHorizontal: 20,
    backgroundColor: Colors.light.ivory,
  },
  filterLabel: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.glassBackground,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: 100, // Reduced width for compact look
    marginRight: 16,
    alignItems: "center",
    // Removed background, shadow, and border to match "Top Cast" style
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.light.gold, // Added gold border for elegance
  },
  cardContent: {
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 2,
  },
  location: {
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.6,
    marginBottom: 4,
    textAlign: "center",
  },
  matchBadge: {
    // Optional: Keep or remove based on "Top Cast" strictness. Keeping for utility but making it subtle.
    backgroundColor: Colors.light.glassBackground,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  matchText: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
