import FilterModal from "@/components/Connections/FilterModal"; // Import FilterModal
import SearchMatchCard from "@/components/Connections/SearchMatchCard";
import { Colors } from "@/constants/Colors";
import { searchProfiles } from "@/services/matchService";
import { DEFAULT_FILTERS, FilterState } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const RECENT_SEARCHES = ["Anjali", "Mumbai", "Software Engineer", "Pune"];

// Local type for Search Screen
interface SearchResult {
  id: string;
  name: string;
  age: string;
  location: string;
  job: string;
  matchPercentage: string;
  tags: string[];
  img: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Filter State
  const filterModalRef = useRef<BottomSheetModal>(null);
  const [currentFilters, setCurrentFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchText);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = async (text: string) => {
    // If text is empty and no filters, clear results
    if (!text && isDefaultFilters(currentFilters)) {
      setResults([]);
      return;
    }

    try {
      // Pass filters to searchProfiles
      const data = await searchProfiles(text, {
        minAge: currentFilters.ageRange[0],
        maxAge: currentFilters.ageRange[1],
        city:
          currentFilters.cities.length > 0
            ? currentFilters.cities[0]
            : undefined,
        religion:
          currentFilters.religions.length > 0
            ? currentFilters.religions[0]
            : undefined,
        community:
          currentFilters.communities.length > 0
            ? currentFilters.communities[0]
            : undefined,
        maritalStatus:
          currentFilters.maritalStatus.length > 0
            ? currentFilters.maritalStatus[0]
            : undefined,
      });

      const mapped: SearchResult[] = data.map((p) => ({
        id: p.userId.toString(),
        name: p.fullName,
        age: p.age.toString(),
        location: p.city || "Unknown",
        job: p.occupation || "Software Engineer",
        matchPercentage: (p.matchScore || 75) + "%",
        tags: [p.occupation || "Professional"],
        img:
          p.profilePhotoUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
      }));
      setResults(mapped);
    } catch (e) {
      console.log("Search error", e);
    }
  };

  const isDefaultFilters = (filters: FilterState) => {
    return JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setCurrentFilters(filters);
    handleSearch(searchText); // Trigger search again with new filters
  };

  const handleBack = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <SearchMatchCard
      name={item.name}
      age={item.age}
      job={item.job}
      location={item.location}
      imageUri={item.img}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header / Search Bar Section */}
      <View style={styles.headerContainer}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            {/* Back handled by cancel button mostly, but can be added here if needed */}
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search by name or location..."
              placeholderTextColor="#888"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              filterModalRef.current?.present();
            }}
          >
            <Ionicons name="filter-outline" size={22} color="#C21807" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Searches */}
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentFilesHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {RECENT_SEARCHES.map((search, index) => (
            <TouchableOpacity key={index} style={styles.chip}>
              <Text style={styles.chipText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        ref={filterModalRef}
        currentFilters={currentFilters}
        onApply={handleApplyFilters}
        onClose={() => filterModalRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recentSearchesContainer: {
    paddingVertical: 10,
  },
  recentFilesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cancelText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 5,
  },
  chip: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
