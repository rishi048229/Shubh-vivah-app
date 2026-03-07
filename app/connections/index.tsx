import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";
import ExploreAllButton from "@/components/Connections/ExploreAllButton";
import ModernSearchBar from "@/components/Connections/ModernSearchBar";
import QuickViewModal from "@/components/Connections/QuickViewModal";
import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import { Colors } from "@/constants/Colors";
import { searchProfiles } from "@/services/matchService";
import {
  DEFAULT_FILTERS,
  FilterState,
  MatchProfile,
} from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getSettings } from "@/services/settingsService";

export default function ConnectionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const preferencesRef = useRef<BottomSheetModal>(null);
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(
    null,
  );
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [quickViewVisible, setQuickViewVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    const initialize = async () => {
      try {
        const settings = await getSettings();
        setFilters((prev) => ({
          ...prev,
          ageRange: [settings.minAge || 18, settings.maxAge || 40],
          religions: settings.religions && settings.religions.length > 0 ? [settings.religions[0]] : [],
        }));
      } catch (err) {
        console.error("Failed to load settings on connections feed", err);
      }
      fetchMatches();
    };
    initialize();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // For "Connections", we might want to search with current filters
      // OR just show explore suggestions. Let's use searchProfiles for the grid.
      // If no filters, it returns broad matches.
      const data = await searchProfiles(searchQuery, {
        minAge: filters.ageRange[0],
        maxAge: filters.ageRange[1],
        city: filters.cities.length > 0 ? filters.cities[0] : undefined,
        religion:
          filters.religions.length > 0 ? filters.religions[0] : undefined,
      });

      setMatches(data);
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (profile: MatchProfile) => {
    setSelectedProfile(profile);
    setQuickViewVisible(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce or just trigger fetch
    // For now, let's trigger search directly if user hits enter or stops typing
    // Real-time filtering might need debouncing.
  };

  // Trigger search when query changes (with debounce in real app)
  // Here we just use useEffect or manual trigger.
  // Let's use useEffect to react to query/filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleApplyFilters = (newFilters: any) => {
    // Map sheet filters to FilterState
    const mapped: FilterState = {
      ...DEFAULT_FILTERS,
      ageRange: newFilters.ageRange || [18, 35],
      religions: newFilters.religion !== "Any" ? [newFilters.religion] : [],
      cities: newFilters.city ? [newFilters.city] : [],
      // ... map others if needed
    };
    setFilters(mapped);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  }, [filters, searchQuery]);

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionTitle}>Matches for You</Text>
      <Text style={styles.matchCount}>
        {matches.length} {matches.length === 1 ? "match" : "matches"} found
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (loading || matches.length === 0) return null;
    return (
      <View style={styles.footerContainer}>
        <ExploreAllButton />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={{ color: "#666" }}>Looking for matches...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={60} color={Colors.maroon} />
        <Text style={styles.emptyTitle}>No Matches Found</Text>
        <Text style={styles.emptySubtitle}>
          We couldn't find anyone matching your current preferences. Try adjusting your filters or complete your profile to improve matches!
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/complete-profile" as any)}>
          <Text style={styles.emptyButtonText}>Complete Your Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: MatchProfile;
    index: number;
  }) => (
    <View style={styles.cardWrapper}>
      <ConnectionProfileCard
        profile={item}
        index={index}
        onQuickView={handleQuickView}
      />
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connections</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchContainer, isSearchExpanded && { zIndex: 100 }]}
      >
        <ModernSearchBar
          onSearch={handleSearch}
          onFilterPress={() => preferencesRef.current?.present()}
          onExpandChange={setIsSearchExpanded}
        />
      </View>

      {/* Matches Grid */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onEndReached={() => {
          // Infinite scroll placeholder
          console.log("End reached - fetch more");
        }}
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

      {/* Preferences Sheet */}
      <PreferencesSheet
        ref={preferencesRef}
        onDismiss={() => {}}
        onApply={handleApplyFilters}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        visible={quickViewVisible}
        profile={selectedProfile}
        onClose={() => setQuickViewVisible(false)}
      />
    </View>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 6,
  },
  matchCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120, // Increased for scrolling past bottom nav
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12, // Reduced slightly since gap handles horizontal
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  footerContainer: {
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1406",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
