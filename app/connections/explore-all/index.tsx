import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";
import FilterModal from "@/components/Connections/FilterModal";
import SearchBarWithSuggestions from "@/components/Connections/SearchBarWithSuggestions";
import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
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
  const [matches, setMatches] = useState<MatchProfile[]>(MOCK_MATCHES);
  const [sortBy, setSortBy] = useState<SortOption>("best_match");
  const [menuVisible, setMenuVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const filterModalRef =
    React.useRef<import("@gorhom/bottom-sheet").BottomSheetModal>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMatches(query, filters, sortBy);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterMatches(searchQuery, newFilters, sortBy);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    filterMatches(searchQuery, filters, option);
    setMenuVisible(false);
  };

  const filterMatches = (
    query: string,
    currentFilters: FilterState,
    sortOption: SortOption,
  ) => {
    let filtered = [...MOCK_MATCHES];

    // Apply search and filters (same as in main connections page)
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.name.toLowerCase().includes(lowerQuery) ||
          match.city.toLowerCase().includes(lowerQuery) ||
          match.profession.toLowerCase().includes(lowerQuery) ||
          match.caste.toLowerCase().includes(lowerQuery),
      );
    }

    filtered = filtered.filter(
      (match) =>
        match.age >= currentFilters.ageRange[0] &&
        match.age <= currentFilters.ageRange[1] &&
        match.distance <= currentFilters.distanceRadius,
    );

    if (currentFilters.states.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.states.includes(match.state),
      );
    }

    if (currentFilters.cities.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.cities.includes(match.city),
      );
    }

    if (currentFilters.religions.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.religions.includes(match.religion),
      );
    }

    // Sort
    switch (sortOption) {
      case "nearby":
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case "best_match":
        filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      case "recently_active":
        filtered.sort((a, b) => {
          const statusOrder = { online: 0, recently_active: 1, offline: 2 };
          return statusOrder[a.onlineStatus] - statusOrder[b.onlineStatus];
        });
        break;
      case "newest":
        // For demo, just reverse the array
        filtered.reverse();
        break;
    }

    setMatches(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setMatches([...MOCK_MATCHES]);
      setPage(1);
      setRefreshing(false);
    }, 1000);
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
