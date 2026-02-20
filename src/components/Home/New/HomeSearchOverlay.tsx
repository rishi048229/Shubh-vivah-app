import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type HomeSearchOverlayRef = BottomSheetModal;

interface HomeSearchOverlayProps {
  onSearch?: (query: string) => void;
}

const SUGGESTION_CHIPS = [
  "Marathi",
  "Pune",
  "Engineer",
  "Doctor",
  "Mumbai",
  "USA",
  "30-35",
];

const RECENT_SEARCHES = ["Priya", "Doctor in Pune", "Software Engineer"];

const HomeSearchOverlay = forwardRef<BottomSheetModal, HomeSearchOverlayProps>(
  ({ onSearch }, ref) => {
    const [query, setQuery] = useState("");
    const { dismiss } = useBottomSheetModal();

    const snapPoints = useMemo(() => ["60%", "90%"], []);

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

    const handleSearchCheck = () => {
      if (onSearch) onSearch(query);
      (ref as any)?.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ borderRadius: 24, backgroundColor: "#FFF" }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Header / Input */}
          <View style={styles.header}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={{ marginRight: 8 }}
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Search matches..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearchCheck}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => (ref as any)?.current?.dismiss()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentList}>
              {RECENT_SEARCHES.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recentItem}
                  onPress={() => setQuery(item)}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trending / Suggestions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.chipsContainer}>
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => setQuery(chip)}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12, // Ensure touch target
  },
  cancelText: {
    color: Colors.maroon,
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 12,
  },
  recentList: {
    gap: 16,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  recentText: {
    fontSize: 16,
    color: "#333",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HomeSearchOverlay;
