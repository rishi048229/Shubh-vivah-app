import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CompactProfileCardProps {
  name: string;
  age: number;
  location: string;
  matchScore: number;
  image: string;
  tags?: string[];
  onPress: () => void;
}

export const CompactProfileCard = ({
  name,
  age,
  location,
  matchScore,
  image,
  tags = ["Software Engineer", "Gujarati"],
  onPress,
}: CompactProfileCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Header / Avatar */}
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{matchScore}%</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}, {age}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons
            name="heart-outline"
            size={18}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    margin: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.light.gold,
  },
  matchBadge: {
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: Colors.light.maroon,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
});
