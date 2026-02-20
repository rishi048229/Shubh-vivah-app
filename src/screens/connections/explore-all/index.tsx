import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";
import FilterModal from "@/components/Connections/FilterModal";
import SearchBarWithSuggestions from "@/components/Connections/ModernSearchBar";
import { Colors } from "@/constants/Colors";
import { searchProfiles } from "@/services/matchService";
import {
  DEFAULT_FILTERS,
  FilterState,
  MatchProfile,
  SortOption,
} from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Menu, MenuItem } from "react-native-material-menu";

export default function ExploreAllScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("best_match");
  const [menuVisible, setMenuVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const filterModalRef =
    React.useRef<import("@gorhom/bottom-sheet").BottomSheetModal>(null);

  // Initial Fetch
  React.useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async (
    query = searchQuery,
    currentFilters = filters,
  ) => {
    setRefreshing(true);
    try {
      // Use the shared searchProfiles from index.tsx logic
      // Note: If filters are empty/default, backend should return all (or top) profiles.
      const data = await searchProfiles(query, {
        minAge: currentFilters.ageRange[0],
        maxAge: currentFilters.ageRange[1],
        city:
          currentFilters.cities[0] === "Any"
            ? undefined
            : currentFilters.cities[0],
        religion:
          currentFilters.religions[0] === "Any"
            ? undefined
            : currentFilters.religions[0],
        maritalStatus:
          currentFilters.maritalStatus[0] === "Any"
            ? undefined
            : currentFilters.maritalStatus[0],
        community:
          currentFilters.communities[0] === "Any"
            ? undefined
            : currentFilters.communities[0],
      });

      // Map to UI
      const mapped = data.map((p) => ({
        id: p.userId.toString(),
        name: p.fullName,
        age: p.age,
        location: p.city || "Unknown",
        city: p.city || "Unknown",
        state: "Unknown",
        distance: p.distanceKm || 0,
        matchPercentage: p.matchScore || 75,
        matchReasons: p.religion ? [p.religion] : [], // Use religion as match reason
        imageUri:
          p.profilePhotoUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        profession: p.occupation || "Not Specified", // Use real occupation
        education: p.education || "Not Specified",
        religion: p.religion || "Hindu",
        caste: p.caste || "",
        verified: true,
        onlineStatus: "recently_active" as const,
        maritalStatus: p.maritalStatus || "Never Married",
      }));
      setMatches(mapped);
    } catch (err) {
      console.log("Explore All Error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce this in real app
    fetchMatches(query, filters);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchMatches(searchQuery, newFilters);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    // Sort locally for now as API might not support it
    const sorted = [...matches];
    if (option === "nearby") sorted.sort((a, b) => a.distance - b.distance);
    if (option === "best_match")
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setMatches(sorted);
    setMenuVisible(false);
  };

  const onRefresh = useCallback(() => {
    fetchMatches();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      // Simulate loading more data
      setTimeout(() => {
        // In real app, fetch next page from API
        setPage(page + 1);
        setLoadingMore(false);
      }, 1000);
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "nearby":
        return "Nearby First";
      case "best_match":
        return "Best Match";
      case "recently_active":
        return "Recently Active";
      case "newest":
        return "Newest First";
      default:
        return "Sort By";
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Explore All</Text>
          <Text style={styles.matchCount}>
            {matches.length} {matches.length === 1 ? "profile" : "profiles"}
          </Text>
        </View>

        {/* Sort Menu */}
        <View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="swap-vertical" size={18} color={Colors.maroon} />
            <Text style={styles.sortText}>{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: MatchProfile;
    index: number;
  }) => (
    <View style={styles.cardWrapper}>
      <ConnectionProfileCard profile={item} index={index} />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#2D1406" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Matches</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBarWithSuggestions
            onSearch={handleSearch}
            onFilterPress={() => filterModalRef.current?.present()}
          />
        </View>

        {/* Matches Grid */}
        <FlatList
          data={matches}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.maroon}
              colors={[Colors.maroon]}
            />
          }
        />

        {/* Sort Menu - Positioned absolutely */}
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            anchor={<View />}
            onRequestClose={() => setMenuVisible(false)}
            style={styles.menu}
          >
            <MenuItem
              onPress={() => handleSortChange("best_match")}
              textStyle={styles.menuItem}
            >
              Best Match
            </MenuItem>
            <MenuItem
              onPress={() => handleSortChange("nearby")}
              textStyle={styles.menuItem}
            >
              Nearby First
            </MenuItem>
            <MenuItem
              onPress={() => handleSortChange("recently_active")}
              textStyle={styles.menuItem}
            >
              Recently Active
            </MenuItem>
            <MenuItem
              onPress={() => handleSortChange("newest")}
              textStyle={styles.menuItem}
            >
              Newest First
            </MenuItem>
          </Menu>
        </View>

        {/* Filter Modal */}
        <FilterModal
          ref={filterModalRef}
          onApply={handleApplyFilters}
          currentFilters={filters}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1406",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
  },
  matchCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.maroon,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sortText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.maroon,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  cardWrapper: {
    marginBottom: 0,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 20,
  },
  menu: {
    marginTop: 120,
  },
  menuItem: {
    fontSize: 14,
    color: "#2D1406",
  },
});
