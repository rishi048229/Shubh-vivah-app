import { Colors } from "@/constants/Colors";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface FilterTabsProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FILTERS = ["All", "Unread", "Mutual Interest", "Verified", "New"];

export default function FilterTabs({
  selectedFilter,
  onSelectFilter,
}: FilterTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => onSelectFilter(filter)}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeChip: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  text: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
