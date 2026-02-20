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
});
