import { getSearchSuggestions } from "@/services/matchService";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ModernSearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  onExpandChange?: (expanded: boolean) => void;
  placeholder?: string;
}

// Fallback data
const SUGGESTION_CHIPS = [
  "New York",
  "Software Engineer",
  "Hindu",
  "Doctor",
  "Mumbai",
  "Delhi",
  "MBA",
  "Never Married",
];

const HISTORY_ITEMS = [
  { id: "1", text: "Mumbai" },
  { id: "2", text: "Engineer" },
];

const Colors = {
  maroon: "#8B0000",
  ivory: "#FFFFF0",
  gold: "#FFD700",
  text: "#2D1406",
  placeholder: "#999",
  border: "#E0E0E0",
};

export default function ModernSearchBar({
  onSearch,
  onFilterPress,
  onExpandChange,
  placeholder = "Search Matches...",
}: ModernSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<any>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onExpandChange?.(true);
  };

  const handleBlur = () => {
    // Delay closing to allow clicks on suggestions
    setTimeout(() => {
      setIsFocused(false);
      onExpandChange?.(false);
    }, 200);
  };

  const handleDismiss = () => {
    Keyboard.dismiss();
    setIsFocused(false);
    onExpandChange?.(false);
  };

  const fetchSuggestions = async (text: string) => {
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await getSearchSuggestions(text);
      setSuggestions(results);
    } catch (e) {
      console.log("Suggestion error", e);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text); // Trigger search immediately or you can debounce this too if you want 'real-time' search results not just suggestions

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);
  };

  const handleSuggestionPress = (chip: string) => {
    setSearchQuery(chip);
    onSearch(chip);
    handleDismiss();
  };

  const showSuggestions = isFocused;

  return (
    <View style={styles.container}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchInputWrapper,
            isFocused && styles.searchInputFocused,
          ]}
        >
          {isFocused ? (
            <TouchableOpacity onPress={handleDismiss} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.maroon} />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name="search-outline"
              size={20}
              color={Colors.placeholder}
              style={styles.searchIcon}
            />
          )}

          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            // onBlur handled manually via handleDismiss or timeout in parent if needed
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                onSearch("");
                setSuggestions([]);
              }}
              style={styles.iconButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={24} color={Colors.maroon} />
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown Overlay */}
      {showSuggestions && (
        <View style={styles.dropdownOverlay}>
          <ScrollView
            style={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Suggestions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {suggestions.length > 0 ? "Suggestions" : "Popular"}
              </Text>
              <View style={styles.chipsContainer}>
                {(suggestions.length > 0 ? suggestions : SUGGESTION_CHIPS).map(
                  (chip, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.chip}
                      onPress={() => handleSuggestionPress(chip)}
                    >
                      <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            {/* History Section (Mock) */}
            <View style={styles.section}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <TouchableOpacity>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.historyList}>
                {HISTORY_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => handleSuggestionPress(item.text)}
                  >
                    <View style={styles.historyLeft}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={Colors.text}
                      />
                      <Text style={styles.historyText}>{item.text}</Text>
                    </View>
                    <Ionicons
                      name="arrow-up"
                      size={18}
                      color={Colors.placeholder}
                      style={{ transform: [{ rotate: "45deg" }] }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Close Button Area */}
            <TouchableOpacity style={styles.closeArea} onPress={handleDismiss}>
              <Text style={styles.closeText}>Close Suggestions</Text>
              <Ionicons
                name="chevron-up"
                size={20}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    zIndex: 1000,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInputFocused: {
    borderColor: Colors.maroon,
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  iconButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    marginLeft: 4,
  },
  filterButton: {
    width: 54,
    height: 54,
    backgroundColor: "#FFF",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Dropdown Styling
  dropdownOverlay: {
    position: "absolute",
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 400,
    overflow: "hidden",
  },
  dropdownContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  chipText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "500",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearText: {
    color: Colors.maroon,
    fontSize: 13,
    fontWeight: "600",
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  closeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 20,
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  closeText: {
    fontSize: 14,
    color: Colors.placeholder,
    fontWeight: "500",
  },
});
