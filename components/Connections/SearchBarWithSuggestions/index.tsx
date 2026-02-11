import { Colors } from "@/constants/Colors";
import { SEARCH_SUGGESTIONS } from "@/data/mockConnectionsData";
import { SearchSuggestion } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface SearchBarWithSuggestionsProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export default function SearchBarWithSuggestions({
  onSearch,
  onFilterPress,
  placeholder = "Search by name, city, profession...",
}: SearchBarWithSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const expandHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    expandHeight.value = withTiming(280, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(1, { duration: 300 });
  };

  const handleBlur = () => {
    // Delay to allow clicks on suggestions
    setTimeout(() => {
      setIsFocused(false);
      expandHeight.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    }, 150);
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.label);
    onSearch(suggestion.label);
    Keyboard.dismiss();
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const animatedSuggestionsStyle = useAnimatedStyle(() => ({
    height: expandHeight.value,
    opacity: opacity.value,
  }));

  const filteredSuggestions = searchQuery
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : SEARCH_SUGGESTIONS;

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon as any} size={18} color={Colors.maroon} />
      <Text style={styles.suggestionText}>{item.label}</Text>
      {item.type === "recent" && (
        <Ionicons name="close-circle" size={16} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Keyboard.dismiss();
            onFilterPress();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="options" size={20} color={Colors.maroon} />
        </TouchableOpacity>
      </View>

      {/* Suggestions Panel */}
      {isFocused && (
        <Animated.View
          style={[styles.suggestionsPanel, animatedSuggestionsStyle]}
        >
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            renderItem={renderSuggestion}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#2D1406",
  },
  filterButton: {
    marginLeft: 10,
    padding: 4,
  },
  suggestionsPanel: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D1406",
  },
  clearText: {
    fontSize: 13,
    color: Colors.maroon,
    fontWeight: "600",
  },
  suggestionsList: {
    paddingHorizontal: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#2D1406",
  },
});
