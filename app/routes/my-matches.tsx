import ConnectionProfileCard from "@/components/Connections/ConnectionProfileCard";
import QuickViewModal from "@/components/Connections/QuickViewModal";
import { Colors } from "@/constants/Colors";
import { getMatchedProfiles } from "@/services/matchService";
import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
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

export default function MyMatchesScreen() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [quickViewVisible, setQuickViewVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const results = await getMatchedProfiles();
      setMatches(results);
    } catch (error) {
      console.log("Error fetching mutual matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (profile: MatchProfile) => {
    setSelectedProfile(profile);
    setQuickViewVisible(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  }, []);

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionTitle}>Mutual Matches</Text>
      <Text style={styles.matchCount}>
        {matches.length} {matches.length === 1 ? "match" : "matches"} found
      </Text>
    </View>
  );

  const renderItem = ({ item, index }: { item: MatchProfile; index: number }) => (
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Matches</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Matches Grid */}
      {loading && matches.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#666" }}>Loading matches...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Ionicons name="heart-dislike-outline" size={60} color={Colors.maroon} />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#333" }}> No Mutual Matches Yet</Text>
          <Text style={{ textAlign: "center", color: "#666", marginTop: 4 }}>Interact with more profiles to create a connection!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.maroon}
              colors={[Colors.maroon]}
            />
          }
        />
      )}

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
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
});
