import CustomSlider from "@/components/ui/CustomSlider";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
  // Matrimonial Filters
  const filters = ["Marital Status", "Religion", "Community", "Profession"];

  return (
    <View style={styles.barContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
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
  const [ageRange, setAgeRange] = useState({ min: 21, max: 35 });

  // State for selectable chips
  const [selectedMaritalStatus, setSelectedMaritalStatus] =
    useState<string>("Any");

  React.useEffect(() => {
    height.value = withSpring(isOpen ? 550 : 0, {
      // Increased height for more content
      damping: 20,
      stiffness: 90,
    });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: withTiming(isOpen ? 1 : 0),
  }));

  if (!isOpen && height.value === 0) return null;

  const renderSectionTitle = (title: string, icon: any) => (
    <View style={styles.sectionHeader}>
      <Ionicons
        name={icon}
        size={16}
        color={Colors.light.gold}
        style={{ marginRight: 6 }}
      />
      <Text style={styles.sectionLabel}>{title}</Text>
    </View>
  );

  const renderChips = (
    options: string[],
    selected: string,
    onSelect: (val: string) => void,
  ) => (
    <View style={styles.chipContainer}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipSelected]}
          onPress={() => onSelect(opt)}
        >
          <Text
            style={[
              styles.chipText,
              selected === opt && styles.chipTextSelected,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Animated.View style={[styles.panelContainer, animatedStyle]}>
      <ScrollView
        style={styles.panelContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.panelTitle}>Refine Your Partner Search</Text>

        {/* Age Range Slider */}
        <View style={styles.filterSection}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            {renderSectionTitle("Age Range", "calendar")}
            <Text style={styles.valueText}>
              {ageRange.min} - {ageRange.max} Yrs
            </Text>
          </View>
          <View style={{ alignItems: "center", paddingVertical: 10 }}>
            <CustomSlider
              min={18}
              max={60}
              initialMin={21}
              initialMax={35}
              onValueChange={(min, max) => setAgeRange({ min, max })}
            />
          </View>
        </View>

        {/* Marital Status */}
        <View style={styles.filterSection}>
          {renderSectionTitle("Marital Status", "heart")}
          {renderChips(
            ["Any", "Never Married", "Divorced", "Widowed", "Awaiting Divorce"],
            selectedMaritalStatus,
            setSelectedMaritalStatus,
          )}
        </View>

        {/* Religion */}
        <View style={styles.filterSection}>
          {renderSectionTitle("Religion", "people")}
          {/* Just visual mock for now */}
          {renderChips(
            ["Hindu", "Muslim", "Sikh", "Christian", "Jain"],
            "Hindu",
            () => {},
          )}
        </View>

        {/* Profession */}
        <View style={styles.filterSection}>
          {renderSectionTitle("Profession", "briefcase")}
          {renderChips(
            ["Any", "Engineer", "Doctor", "Business", "Teacher", "Govt. Job"],
            "Any",
            () => {},
          )}
        </View>

        {/* Feature #10: Smart Time-Based Filters */}
        <View style={styles.filterSection}>
          {renderSectionTitle("Smart Filters", "flash")}
          <View style={styles.chipContainer}>
            {["🔥 Active Now", "⚡ Replies Fast", "🌙 Online Today"].map(
              (filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.timeChip,
                    { backgroundColor: "#e3f2fd", borderColor: "#2196f3" },
                  ]}
                >
                  <Text
                    style={{
                      color: "#1565c0",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Spacer for bottom actions */}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.clearBtn} onPress={onClose}>
          <Text style={styles.clearText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>
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
    elevation: 8,
    zIndex: 9,
    maxHeight: 600,
  },
  panelContent: {
    padding: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  valueText: {
    fontSize: 14,
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#eee",
  },
  chipSelected: {
    backgroundColor: Colors.light.gold,
    borderColor: Colors.light.gold,
  },
  chipText: {
    fontSize: 13,
    color: "#666",
  },
  chipTextSelected: {
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  clearBtn: {
    padding: 10,
  },
  clearText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  applyBtn: {
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: Colors.light.maroon,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  applyText: {
    color: "#fff", // White text on maroon button
    fontWeight: "bold",
    fontSize: 15,
  },
});
