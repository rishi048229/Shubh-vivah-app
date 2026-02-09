import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import {
    MatchmakingDto,
    matchmakingService,
} from "@/services/matchmakingService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ExploreOverlay } from "./ExploreOverlay";
import { FullScreenMap } from "./FullScreenMap";
import { PeopleCard } from "./PeopleCard";
import { FilterState } from "./PeopleFilterBar";

interface PeopleNearYouSectionProps {
  searchQuery?: string;
  filters?: FilterState | null;
}

export const PeopleNearYouSection = ({
  searchQuery = "",
  filters,
}: PeopleNearYouSectionProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  // API state
  const [people, setPeople] = useState<MatchmakingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profiles when search or filters change
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use browseProfiles for testing (doesn't require user's own profile)
        const matches = await matchmakingService.browseProfiles({
          search: searchQuery || undefined,
          minAge: filters?.ageRange?.min,
          maxAge: filters?.ageRange?.max,
          religion:
            filters?.religion !== "Hindu" ? filters?.religion : undefined, // Skip default
        });
        setPeople(matches);
      } catch (err: any) {
        console.error("Failed to fetch profiles", err);
        setError(err.response?.data?.message || "Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [searchQuery, filters]);

  // Client-side profession filter (since backend doesn't have it yet)
  // Client-side filtering
  const { profileData } = useProfile();

  const filteredPeople = useMemo(() => {
    let result = [...people];

    // Profession filter (skip if "Any")
    if (filters?.profession && filters.profession !== "Any") {
      result = result.filter((person) =>
        person.occupation
          ?.toLowerCase()
          .includes(filters.profession.toLowerCase()),
      );
    }

    // Location Filter
    if (filters?.location) {
      if (filters.location === "Your City" && profileData?.city) {
        result = result.filter(
          (person) =>
            person.city?.toLowerCase() === profileData.city?.toLowerCase(),
        );
      } else if (filters.location === "Your State" && profileData?.state) {
        // Assuming state matching if available, otherwise skip
      } else if (filters.location === "Nearby") {
        // Placeholder for nearby logic
      }
      // "Anywhere" is default, no filter
    }

    // Smart Filters (Mock Logic for Demo if backend doesn't support yet)
    if (filters?.smartFilters?.activeNow) {
      // Mock: Filter by odd/even ID to show visual change
      result = result.filter((p) => p.userId % 2 !== 0);
    }
    if (filters?.smartFilters?.onlineToday) {
      result = result.filter((p) => p.userId % 3 !== 0);
    }
    if (filters?.smartFilters?.repliesFast) {
      result = result.filter((p) => p.matchScore > 80);
    }

    return result;
  }, [people, filters, profileData]);

  const handleMapToggle = () => {
    setIsMapOpen(true);
    setViewMode("map");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>People Near You</Text>
          <TouchableOpacity onPress={() => setIsExploreOpen(true)}>
            <Text style={styles.exploreLink}>Explore All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "map" && styles.activeToggleBtn,
            ]}
            onPress={handleMapToggle}
          >
            <Ionicons
              name="map-outline"
              size={16}
              color={viewMode === "map" ? Colors.light.maroon : "#888"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "list" && styles.activeToggleBtn,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={viewMode === "list" ? Colors.light.maroon : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Screen Map Modal */}
      <FullScreenMap visible={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* Explore Overlay Modal */}
      <ExploreOverlay
        visible={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
      />

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.maroon} />
          <Text style={styles.loadingText}>Finding matches...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              matchmakingService
                .browseProfiles()
                .then(setPeople)
                .catch((err: Error) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredPeople.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No matches found yet</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || filters
              ? "Try adjusting your search or filters"
              : "Complete your profile to get better matches"}
          </Text>
        </View>
      ) : (
        <Animated.View entering={FadeIn} style={styles.listContainer}>
          {filteredPeople.map((person) => (
            <PeopleCard
              key={person.userId}
              name={person.fullName}
              age={person.age}
              distance={person.city || "Unknown"}
              matchScore={Math.round(person.matchScore)}
              image={`https://i.pravatar.cc/150?u=${person.userId}`}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleRow: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  exploreLink: {
    fontSize: 12,
    color: Colors.light.gold,
    fontWeight: "600",
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeToggleBtn: {
    backgroundColor: Colors.light.gold,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: "#E6F4FE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  mapText: {
    marginTop: 10,
    color: "#666",
    fontWeight: "500",
  },
  mockPin: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pinImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  listContainer: {
    gap: 4,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#888",
    fontSize: 14,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 4,
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
  },
});
