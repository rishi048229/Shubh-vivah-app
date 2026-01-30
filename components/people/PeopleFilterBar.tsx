import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface FilterBarProps {
  onExpand: () => void;
  isExpanded: boolean;
}

export const PeopleFilterBar = ({ onExpand, isExpanded }: FilterBarProps) => {
  const filters = ["Age", "Location", "Community", "Kundali"];

  return (
    <View style={styles.barContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, styles.activeFilterChip]}
          onPress={onExpand}
        >
          <Ionicons name="options" size={16} color={Colors.light.ivory} />
        </TouchableOpacity>

        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.filterChip}
            onPress={onExpand}
          >
            <Text style={styles.filterText}>{filter}</Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={Colors.light.maroon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export const PeopleFilterPanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const height = useSharedValue(0);

  React.useEffect(() => {
    height.value = withSpring(isOpen ? 300 : 0, {
      damping: 20,
      stiffness: 90,
    });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: withTiming(isOpen ? 1 : 0),
  }));

  if (!isOpen && height.value === 0) return null;

  return (
    <Animated.View style={[styles.panelContainer, animatedStyle]}>
      <View style={styles.panelContent}>
        <Text style={styles.panelTitle}>Refine Matches</Text>

        {/* Mock Filter Options */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>Age Range</Text>
          <View style={styles.rangePlaceholder}>
            <Text style={styles.rangeText}>22 - 28 Years</Text>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>Location Radius</Text>
          <View style={styles.rangePlaceholder}>
            <Text style={styles.rangeText}>Within 50 km</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: Colors.light.ivory,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    gap: 4,
  },
  activeFilterChip: {
    backgroundColor: Colors.light.maroon,
    borderColor: Colors.light.maroon,
  },
  filterText: {
    fontSize: 12,
    color: Colors.light.maroon,
    fontWeight: "500",
  },
  panelContainer: {
    backgroundColor: "#FFF",
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 9,
  },
  panelContent: {
    padding: 20,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  rangePlaceholder: {
    backgroundColor: Colors.light.ivory,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  rangeText: {
    fontSize: 14,
    color: Colors.light.maroon,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  clearBtn: {
    padding: 10,
  },
  clearText: {
    color: "#666",
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  applyText: {
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
});
