import {
    FilterState,
    PeopleFilterBar,
    PeopleFilterPanel,
} from "@/components/people/PeopleFilterBar";
import { PeopleNearYouSection } from "@/components/people/PeopleNearYouSection";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConnectionsScreen() {
  const insets = useSafeAreaInsets();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null,
  );

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky Filter Bar */}
      <PeopleFilterBar
        isExpanded={isFilterOpen}
        onExpand={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Expandable Filter Panel (Overlay) */}
      <View style={styles.panelWrapper}>
        <PeopleFilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={22}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations, people, and more..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterBtnPressed}
            onPress={() => setIsFilterOpen(!isFilterOpen)}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="always"
        decelerationRate="normal"
        keyboardShouldPersistTaps="handled"
      >
        <PeopleNearYouSection
          searchQuery={searchQuery}
          filters={appliedFilters}
        />
      </ScrollView>

      {/* Floating Match Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsFilterOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="heart-circle"
          size={24}
          color="#FFF"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.fabText}>Find My Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.light.ivory,
    paddingBottom: 10,
    marginTop: 60, // Adjust for filter bar
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingRight: 5, // Space for button
    height: 52,
    borderRadius: 30, // Pill shape
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    height: "100%",
  },
  filterBtnPressed: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#222", // Dark button as requested
    justifyContent: "center",
    alignItems: "center",
  },
  panelWrapper: {
    position: "absolute",
    top: 100, // Adjust based on header height + filter bar
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20, // Tab bar height is handled by layout tabs logic usually, but here we might need more margin if tab bar is translucent
    right: 20,
    backgroundColor: Colors.light.maroon,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 90,
  },
  fabText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
