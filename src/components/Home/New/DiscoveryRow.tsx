import { MatchProfile } from "@/types/connections";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuickViewCard from "./QuickViewCard";

interface DiscoveryRowProps {
  title: string;
  profiles: MatchProfile[];
  onProfilePress: (profile: MatchProfile) => void;
  onSeeAllPress?: () => void;
}

export default function DiscoveryRow({
  title,
  profiles,
  onProfilePress,
  onSeeAllPress,
}: DiscoveryRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            As our user base grows, we will show up our users accordingly.
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={profiles}
          renderItem={({ item }) => (
            <QuickViewCard profile={item} onPress={() => onProfilePress(item)} />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#D32F2F", // Action color
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    marginHorizontal: 20,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
