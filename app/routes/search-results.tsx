import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as matchService from "@/services/matchService";
import { MatchProfile } from "@/types/connections";
import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";

export default function SearchResultsScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const router = useRouter();
  const [results, setResults] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    try {
      const data = await matchService.searchProfiles(q);
      setResults(data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePress = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Query info */}
      <View style={styles.queryContainer}>
        <Text style={styles.queryText}>
          Showing results for "<Text style={{ fontWeight: "700" }}>{query}</Text>"
        </Text>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.maroon} />
          <Text style={{ marginTop: 12, color: "#666" }}>Searching...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 16 }}>
              <ConnectionProfileCard
                profile={item}
                index={index}
                onQuickView={() => handleProfilePress(item.id)}
              />
            </View>
          )}
        />
      ) : (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No users found named "{query}"</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    paddingTop: 50,
    backgroundColor: "#FFF",
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  queryContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
  queryText: {
    fontSize: 15,
    color: "#444",
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
