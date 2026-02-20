import { Colors } from "@/constants/Colors";
import {
    CITY_OPTIONS,
    EDUCATION_OPTIONS,
    MARITAL_STATUS_OPTIONS,
    PROFESSION_OPTIONS,
    RELIGION_OPTIONS,
    STATE_OPTIONS,
} from "@/data/mockConnectionsData";
import { DEFAULT_FILTERS, FilterState } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

interface FilterModalProps {
  onClose?: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const FilterModal = forwardRef<BottomSheetModal, FilterModalProps>(
  ({ onClose, onApply, currentFilters }, ref) => {
    const [filters, setFilters] = useState<FilterState>(currentFilters);
    const snapPoints = useMemo(() => ["75%", "90%"], []);

    // Sync local state when modal opens/filters change
    useEffect(() => {
      setFilters(currentFilters);
    }, [currentFilters]);

    const handleApply = () => {
      onApply(filters);
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    const handleReset = () => {
      setFilters(DEFAULT_FILTERS);
    };

    const toggleArrayFilter = (key: keyof FilterState, value: string) => {
      const currentArray = filters[key] as string[];
      if (currentArray.includes(value)) {
        setFilters({
          ...filters,
          [key]: currentArray.filter((item) => item !== value),
        });
      } else {
        setFilters({
          ...filters,
          [key]: [...currentArray, value],
        });
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity
              onPress={() =>
                (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
              }
            >
              <Ionicons name="close" size={24} color="#2D1406" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Age Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Age Range</Text>
              <View style={styles.rangeContainer}>
                <Text style={styles.rangeLabel}>
                  {filters.ageRange[0]} - {filters.ageRange[1]} years
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={60}
                step={1}
                value={filters.ageRange[0]}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    ageRange: [value, filters.ageRange[1]],
                  })
                }
                minimumTrackTintColor={Colors.maroon}
                maximumTrackTintColor="#DDD"
                thumbTintColor={Colors.maroon}
              />
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={60}
                step={1}
                value={filters.ageRange[1]}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    ageRange: [filters.ageRange[0], value],
                  })
                }
                minimumTrackTintColor={Colors.maroon}
                maximumTrackTintColor={"#DDD"}
                thumbTintColor={Colors.maroon}
              />
            </View>

            {/* Height (Min) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Height</Text>
              <View style={styles.rangeContainer}>
                <Text style={styles.rangeLabel}>
                  {filters.minHeight
                    ? `${Math.floor(filters.minHeight / 12)}'${filters.minHeight % 12}"`
                    : "Any"}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={84} // 7 feet
                step={1}
                value={filters.minHeight || 0}
                onValueChange={(value) =>
                  setFilters({ ...filters, minHeight: value })
                }
                minimumTrackTintColor={Colors.maroon}
                maximumTrackTintColor="#DDD"
                thumbTintColor={Colors.maroon}
              />
            </View>

            {/* Income (Min) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Income (LPA)</Text>
              <View style={styles.rangeContainer}>
                <Text style={styles.rangeLabel}>
                  {filters.minIncome ? `Above ${filters.minIncome} LPA` : "Any"}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={50}
                step={2}
                value={filters.minIncome || 0}
                onValueChange={(value) =>
                  setFilters({ ...filters, minIncome: value })
                }
                minimumTrackTintColor={Colors.maroon}
                maximumTrackTintColor="#DDD"
                thumbTintColor={Colors.maroon}
              />
            </View>

            {/* Profession */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profession</Text>
              <View style={styles.chipContainer}>
                {PROFESSION_OPTIONS.map((prof) => (
                  <TouchableOpacity
                    key={prof}
                    style={[
                      styles.chip,
                      filters.professions.includes(prof) && styles.chipSelected,
                    ]}
                    onPress={() => toggleArrayFilter("professions", prof)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.professions.includes(prof) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {prof}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.rangeContainer}>
                <Text style={styles.rangeLabel}>
                  Within {filters.distanceRadius} km
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={500}
                step={5}
                value={filters.distanceRadius}
                onValueChange={(value) =>
                  setFilters({ ...filters, distanceRadius: value })
                }
                minimumTrackTintColor={Colors.maroon}
                maximumTrackTintColor="#DDD"
                thumbTintColor={Colors.maroon}
              />
            </View>

            {/* States */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>State</Text>
              <View style={styles.chipContainer}>
                {STATE_OPTIONS.map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={[
                      styles.chip,
                      filters.states.includes(state) && styles.chipSelected,
                    ]}
                    onPress={() => toggleArrayFilter("states", state)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.states.includes(state) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>City</Text>
              <View style={styles.chipContainer}>
                {CITY_OPTIONS.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.chip,
                      filters.cities.includes(city) && styles.chipSelected,
                    ]}
                    onPress={() => toggleArrayFilter("cities", city)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.cities.includes(city) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Religion */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Religion</Text>
              <View style={styles.chipContainer}>
                {RELIGION_OPTIONS.map((religion) => (
                  <TouchableOpacity
                    key={religion}
                    style={[
                      styles.chip,
                      filters.religions.includes(religion) &&
                        styles.chipSelected,
                    ]}
                    onPress={() => toggleArrayFilter("religions", religion)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.religions.includes(religion) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {religion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Education */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              <View style={styles.chipContainer}>
                {EDUCATION_OPTIONS.map((education) => (
                  <TouchableOpacity
                    key={education}
                    style={[
                      styles.chip,
                      filters.educationLevels.includes(education) &&
                        styles.chipSelected,
                    ]}
                    onPress={() =>
                      toggleArrayFilter("educationLevels", education)
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.educationLevels.includes(education) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {education}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Manglik Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manglik Status</Text>
              <View style={styles.chipContainer}>
                {["any", "yes", "no"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      filters.manglikStatus === status && styles.chipSelected,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        manglikStatus: status as "yes" | "no" | "any",
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.manglikStatus === status &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Marital Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Marital Status</Text>
              <View style={styles.chipContainer}>
                {MARITAL_STATUS_OPTIONS.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      filters.maritalStatus.includes(status) &&
                        styles.chipSelected,
                    ]}
                    onPress={() => toggleArrayFilter("maritalStatus", status)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.maritalStatus.includes(status) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    );
  },
);

export default FilterModal;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.ivory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: Colors.maroon,
    width: 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D1406",
    marginBottom: 12,
  },
  rangeContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.maroon,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  chipSelected: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  chipText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.maroon,
  },
  resetButtonText: {
    color: Colors.maroon,
    fontSize: 15,
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: Colors.maroon,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
