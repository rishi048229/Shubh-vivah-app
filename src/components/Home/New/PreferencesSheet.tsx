import { Colors } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Heart,
  Home,
  SlidersHorizontal,
  Users,
} from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PreferencesSheetProps {
  onDismiss: () => void;
  onApply?: (filters: any) => void;
}

const SECTIONS = [
  {
    id: "marital",
    title: "Marital Status",
    type: "chips",
    options: [
      "Any",
      "Never Married",
      "Divorced",
      "Widowed",
      "Awaiting Divorce",
    ],
  },
  {
    id: "religion",
    title: "Religion",
    type: "chips",
    options: ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist"],
  },
  {
    id: "profession",
    title: "Profession",
    type: "chips",
    options: ["Any", "Engineer", "Doctor", "Business", "Teacher", "Govt. Job"],
  },
  {
    id: "community",
    title: "Community",
    type: "chips",
    options: ["Any", "Maratha", "Brahmin", "Kunbi", "Aggarwal", "Rajput"],
  },
  {
    id: "education",
    title: "Education",
    type: "chips",
    options: ["Any", "B.Tech", "MBA", "MBBS", "CA", "Ph.D", "M.Tech"],
  },
  {
    id: "income",
    title: "Annual Income",
    type: "chips",
    options: ["Any", "0-5 LPA", "5-10 LPA", "10-20 LPA", "20-50 LPA", "50L+"],
  },
  {
    id: "diet",
    title: "Diet",
    type: "chips",
    options: ["Any", "Vegetarian", "Non-Vegetarian", "Eggetarian", "Jain"],
  },
  {
    id: "height",
    title: "Height",
    type: "chips",
    options: ["Any", "4'5\" - 5'", "5' - 5'5\"", "5'5\" - 5'10\"", "5'10\"+"],
  },
];

const PreferencesSheet = forwardRef<BottomSheetModal, PreferencesSheetProps>(
  ({ onDismiss, onApply }, ref) => {
    // 90% height for a nice tall sheet
    const snapPoints = useMemo(() => ["85%"], []);
    const insets = useSafeAreaInsets();

    // State
    const [ageRange, setAgeRange] = useState(25); // Simplified single thumb for demo, or we can do a range if lib supports it well. standard slider is single thumb.
    // For range we often need a custom component or two sliders.
    // Let's stick to a simple visual representation of a range for now to match the "slider" look.
    // Actually, react-native-community/slider is single thumb.
    // The user image shows two thumbs. I will simulate a "Max Age" slider for now to keep it robust without extra libs.
    const [maxAge, setMaxAge] = useState(32);

    const [selectedFilters, setSelectedFilters] = useState<
      Record<string, string>
    >({
      marital: "Divorced",
      religion: "Hindu",
      profession: "Any",
      community: "Any",
      education: "Any",
      income: "Any",
      diet: "Any",
      height: "Any",
    });

    const handleSelect = (sectionId: string, option: string) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [sectionId]: option,
      }));
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                const mappedFilters: any = {
                  ...selectedFilters,
                  ageRange: [18, maxAge],
                  cities:
                    selectedFilters.city && selectedFilters.city !== "Any"
                      ? [selectedFilters.city]
                      : [],
                  religions:
                    selectedFilters.religion &&
                    selectedFilters.religion !== "Any"
                      ? [selectedFilters.religion]
                      : [],
                  communities:
                    selectedFilters.community &&
                    selectedFilters.community !== "Any"
                      ? [selectedFilters.community]
                      : [],
                  professions:
                    selectedFilters.profession &&
                    selectedFilters.profession !== "Any"
                      ? [selectedFilters.profession]
                      : [],
                  maritalStatus:
                    selectedFilters.marital && selectedFilters.marital !== "Any"
                      ? [selectedFilters.marital]
                      : [],
                  educationLevels:
                    selectedFilters.education &&
                    selectedFilters.education !== "Any"
                      ? [selectedFilters.education]
                      : [],
                  lifestylePreferences:
                    selectedFilters.diet && selectedFilters.diet !== "Any"
                      ? [selectedFilters.diet]
                      : [],
                };

                onApply?.(mappedFilters);
                (ref as any)?.current?.dismiss();
              }}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetFooter>
      ),
      [insets.bottom, maxAge, onApply, ref, selectedFilters],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        enablePanDownToClose
        onDismiss={onDismiss}
        backgroundStyle={{ backgroundColor: "#FFF", borderRadius: 24 }}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => (ref as any)?.current?.dismiss()}>
              <View style={styles.closeIconContainer}>
                <SlidersHorizontal size={20} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Top Chips Row (Mocking the top filter bar in screenshot) */}
            <View style={styles.topFilterScroll}>
              <TouchableOpacity style={styles.topFilterChip}>
                <Text style={styles.topFilterText}>Marital Status</Text>
                <ChevronDown size={12} color="#C21807" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topFilterChip}>
                <Text style={styles.topFilterText}>Religion</Text>
                <ChevronDown size={12} color="#C21807" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topFilterChip}>
                <Text style={styles.topFilterText}>Community</Text>
                <ChevronDown size={12} color="#C21807" />
              </TouchableOpacity>
            </View>
          </View>

          <BottomSheetScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.mainTitle}>Refine Your Partner Search</Text>

            {/* Age Range Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.iconTitle}>
                  <Calendar size={18} color="#8B0000" />
                  <Text style={styles.sectionTitle}>Age Range</Text>
                </View>
                <Text style={styles.rangeValue}>
                  18 - {Math.round(maxAge)} Yrs
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={18}
                  maximumValue={50}
                  step={1}
                  value={maxAge}
                  onValueChange={setMaxAge}
                  minimumTrackTintColor={Colors.maroon}
                  maximumTrackTintColor="#EEE"
                  thumbTintColor={Colors.maroon}
                />
              </View>
            </View>

            {/* Dynamic Sections */}
            {SECTIONS.map((section) => (
              <View key={section.id} style={styles.section}>
                <View style={styles.iconTitle}>
                  {section.id === "marital" && (
                    <Heart size={18} color="#8B0000" />
                  )}
                  {section.id === "religion" && (
                    <Users size={18} color="#8B0000" />
                  )}
                  {section.id === "profession" && (
                    <Briefcase size={18} color="#8B0000" />
                  )}
                  {section.id === "community" && (
                    <Home size={18} color="#8B0000" />
                  )}
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>

                <View style={styles.chipsContainer}>
                  {section.options.map((option) => {
                    const isSelected = selectedFilters[section.id] === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[styles.chip, isSelected && styles.selectedChip]}
                        onPress={() => handleSelect(section.id, option)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.selectedChipText,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <View style={{ height: 100 }} />
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory bg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E6D2",
  },
  closeIconContainer: {
    backgroundColor: "#8B0000",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  topFilterScroll: {
    flexDirection: "row",
    gap: 8,
  },
  topFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  topFilterText: {
    fontSize: 12,
    color: "#C21807",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150, // Massive padding to ensure reachability
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B0000",
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  selectedChip: {
    backgroundColor: "#8B0000", // Maroon
    borderColor: "#8B0000",
  },
  chipText: {
    color: "#666",
    fontSize: 14,
  },
  selectedChipText: {
    color: "#FFF",
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFF0",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  applyButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  applyText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PreferencesSheet;
