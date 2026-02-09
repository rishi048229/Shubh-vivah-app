import CustomSlider from "@/components/ui/CustomSlider";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: FilterState) => void;
}

export interface FilterState {
  ageRange: [number, number];
  location: string | null;
  religion: string | null;
  education: string | null;
}

const LOCATIONS = [
  "Any",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
];
const RELIGIONS = [
  "Any",
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Jain",
  "Buddhist",
];
const EDUCATION_LEVELS = [
  "Any",
  "B.Tech/B.E.",
  "MBBS/MD",
  "MBA",
  "CA",
  "PhD",
  "Post Graduate",
  "Graduate",
];
const AGE_OPTIONS = [18, 21, 23, 25, 27, 30, 33, 35, 40, 45, 50, 55];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const insets = useSafeAreaInsets();
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(35);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(
    null,
  );

  const handleApply = () => {
    onApply?.({
      ageRange: [minAge, maxAge],
      location: selectedLocation !== "Any" ? selectedLocation : null,
      religion: selectedReligion !== "Any" ? selectedReligion : null,
      education: selectedEducation !== "Any" ? selectedEducation : null,
    });
    onClose();
  };

  const handleReset = () => {
    setMinAge(21);
    setMaxAge(35);
    setSelectedLocation(null);
    setSelectedReligion(null);
    setSelectedEducation(null);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(200)}
          style={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Filter Matches</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Age Range */}
              <View style={styles.section}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text style={styles.sectionTitle}>Age Range</Text>
                  <View style={styles.ageDisplay}>
                    <Text style={styles.ageText}>
                      {minAge} - {maxAge} years
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "center", paddingVertical: 10 }}>
                  <CustomSlider
                    min={18}
                    max={60}
                    initialMin={minAge}
                    initialMax={maxAge}
                    onValueChange={(min, max) => {
                      setMinAge(min);
                      setMaxAge(max);
                    }}
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.chips}>
                  {LOCATIONS.map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.chip,
                        selectedLocation === loc && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedLocation(loc)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedLocation === loc && styles.chipTextSelected,
                        ]}
                      >
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Religion */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Religion</Text>
                <View style={styles.chips}>
                  {RELIGIONS.map((rel) => (
                    <TouchableOpacity
                      key={rel}
                      style={[
                        styles.chip,
                        selectedReligion === rel && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedReligion(rel)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedReligion === rel && styles.chipTextSelected,
                        ]}
                      >
                        {rel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Education */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.chips}>
                  {EDUCATION_LEVELS.map((edu) => (
                    <TouchableOpacity
                      key={edu}
                      style={[
                        styles.chip,
                        selectedEducation === edu && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedEducation(edu)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedEducation === edu && styles.chipTextSelected,
                        ]}
                      >
                        {edu}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </GestureHandlerRootView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  ageDisplay: {
    backgroundColor: Colors.light.lightMaroon,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  ageText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
  ageLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
    marginTop: 8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  ageChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minWidth: 44,
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: Colors.light.maroon,
    borderColor: Colors.light.maroon,
  },
  chipText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#FFF",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.maroon,
    alignItems: "center",
  },
  resetText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: Colors.light.maroon,
    alignItems: "center",
  },
  applyText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.gold,
  },
});
