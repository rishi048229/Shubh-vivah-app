import { FilterModal, FilterState } from "@/components/FilterModal";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const MATCHES = [
  {
    id: 1,
    name: "Ananya",
    age: 24,
    city: "Mumbai",
    match: 95,
    image: "https://i.pravatar.cc/150?img=1",
    reason: "Your families belong to the same community.",
  },
  {
    id: 2,
    name: "Priya",
    age: 25,
    city: "Delhi",
    match: 92,
    image: "https://i.pravatar.cc/150?img=5",
    reason: "Both of you are Software Engineers.",
  },
  {
    id: 3,
    name: "Sneha",
    age: 26,
    city: "Bangalore",
    match: 88,
    image: "https://i.pravatar.cc/150?img=9",
    reason: "Horoscope match score is high (32/36).",
  },
  {
    id: 4,
    name: "Kavya",
    age: 23,
    city: "Hyderabad",
    match: 90,
    image: "https://i.pravatar.cc/150?img=16",
    reason: "She is looking for a partner in Mumbai.",
  },
  {
    id: 5,
    name: "Ritika",
    age: 25,
    city: "Chennai",
    match: 85,
    image: "https://i.pravatar.cc/150?img=20",
    reason: "Shared interest in classical music.",
  },
];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const MatchFeed = () => {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Applied filters:", newFilters);
    // In real app, refetch matches with these filters
  };

  // Calculate active index for the card pop-up effect
  const getActiveCardStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SNAP_INTERVAL,
        index * SNAP_INTERVAL,
        (index + 1) * SNAP_INTERVAL,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1.05, 0.9],
        Extrapolate.CLAMP,
      );

      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [10, -5, 10],
        Extrapolate.CLAMP,
      );

      return {
        transform: [{ scale }, { translateY }],
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People You May Like</Text>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={styles.filterBtn}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={Colors.light.maroon}
          />
          {filters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <AnimatedScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {MATCHES.map((match, index) => (
          <TouchableOpacity
            key={match.id}
            activeOpacity={0.9}
            onPress={() => router.push(`/profile-details/${match.id}`)}
          >
            <Animated.View style={[styles.card, getActiveCardStyle(index)]}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: match.image }} style={styles.image} />
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{match.match}% Match</Text>
                </View>
              </View>

              <Text style={styles.name}>
                {match.name}, {match.age}
              </Text>
              <Text style={styles.city}>{match.city}</Text>

              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Why this match?</Text>
                <Text style={styles.reasonText} numberOfLines={2}>
                  {match.reason}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="heart-outline"
                    size={18}
                    color={Colors.light.maroon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={Colors.light.maroon}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </AnimatedScrollView>

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  filterBtn: {
    position: "relative",
    padding: 4,
  },
  filterDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    alignItems: "center",
    backgroundColor: Colors.light.ivory,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.light.gold,
  },
  matchBadge: {
    position: "absolute",
    bottom: -5,
    alignSelf: "center",
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 9,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  city: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: "rgba(128, 0, 0, 0.08)",
    borderRadius: 20,
  },
  reasonContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.1)", // Light gold bg
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 10,
    color: "#555",
    lineHeight: 14,
  },
});
