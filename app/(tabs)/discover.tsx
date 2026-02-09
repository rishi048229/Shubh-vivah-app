import { FilterModal, FilterState } from "@/components/FilterModal";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);

  const handleFilterPress = () => {
    setShowFilter(true);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Applied discover filters:", newFilters);
    // In real app, refetch profiles with these filters
  };

  return (
    <View style={styles.container}>
      {/* Header Overlay */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Discover</Text>
          <TouchableOpacity
            style={[styles.filterButton, filters && styles.filterActive]}
            onPress={handleFilterPress}
          >
            <Ionicons name="options" size={24} color="#FFF" />
            {filters && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main Swipe Deck */}
      <View style={styles.deckContainer}>
        <SwipeDeck />
      </View>

      {/* Bottom info hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Swipe for more matches</Text>
        <Ionicons name="chevron-down" size={20} color="#FFF" />
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterActive: {
    backgroundColor: Colors.light.maroon,
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.gold,
  },
  deckContainer: {
    flex: 1,
  },
  hintContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  hintText: {
    color: "#FFF",
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "500",
  },
});
