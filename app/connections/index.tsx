import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";
import ExploreAllButton from "@/components/Connections/ExploreAllButton";
import ModernSearchBar from "@/components/Connections/ModernSearchBar";
import QuickViewModal from "@/components/Connections/QuickViewModal";
import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import {
  DEFAULT_FILTERS,
  FilterState,
  MatchProfile,
} from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
  const [matches, setMatches] = useState<MatchProfile[]>(MOCK_MATCHES);

  const handleQuickView = (profile: MatchProfile) => {
    setSelectedProfile(profile);
    setQuickViewVisible(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMatches(query, filters);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterMatches(searchQuery, newFilters);
  };

  const filterMatches = (query: string, currentFilters: FilterState) => {
    let filtered = [...MOCK_MATCHES];

    // Search filter
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

    // Age filter
    filtered = filtered.filter(
      (match) =>
        match.age >= currentFilters.ageRange[0] &&
        match.age <= currentFilters.ageRange[1],
    );

    // Distance filter
    filtered = filtered.filter(
      (match) => match.distance <= currentFilters.distanceRadius,
    );

    // State filter
    if (currentFilters.states.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.states.includes(match.state),
      );
    }

    // City filter
    if (currentFilters.cities.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.cities.includes(match.city),
      );
    }

    // Religion filter
    if (currentFilters.religions.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.religions.includes(match.religion),
      );
    }

    // Education filter
    if (currentFilters.educationLevels.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.educationLevels.includes(match.education),
      );
    }

    // Manglik filter
    if (
      currentFilters.manglikStatus &&
      currentFilters.manglikStatus !== "any"
    ) {
      filtered = filtered.filter(
        (match) => match.manglikStatus === currentFilters.manglikStatus,
      );
    }

    // Marital status filter
    if (currentFilters.maritalStatus.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.maritalStatus.includes(match.maritalStatus),
      );
    }

    // Height filter (min height)
    if (currentFilters.minHeight && currentFilters.minHeight > 0) {
      filtered = filtered.filter((match) => {
        if (!match.height) return false;
        const [feet, inches] = match.height
          .replace('"', "")
          .split("'")
          .map(Number);
        const totalInches = (feet || 0) * 12 + (inches || 0);
        return totalInches >= (currentFilters.minHeight || 0);
      });
    }

    // Income filter (min income)
    if (currentFilters.minIncome && currentFilters.minIncome > 0) {
      filtered = filtered.filter((match) => {
        if (!match.income) return false;
        const incomeValue = parseInt(match.income.split(" ")[0]);
        return incomeValue >= (currentFilters.minIncome || 0);
      });
    }

    // Profession filter
    if (currentFilters.professions.length > 0) {
      filtered = filtered.filter((match) =>
        currentFilters.professions.includes(match.profession),
      );
    }

    setMatches(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setMatches([...MOCK_MATCHES]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionTitle}>Matches for You</Text>
      <Text style={styles.matchCount}>
        {matches.length} {matches.length === 1 ? "match" : "matches"} found
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <ExploreAllButton />
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
      <ConnectionProfileCard
        profile={item}
        index={index}
        onQuickView={handleQuickView}
      />
    </View>
  );

  return (
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
      <PreferencesSheet ref={preferencesRef} onDismiss={() => {}} />

      {/* Quick View Modal */}
      <QuickViewModal
        visible={quickViewVisible}
        profile={selectedProfile}
        onClose={() => setQuickViewVisible(false)}
      />
    </SafeAreaView>
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
});
