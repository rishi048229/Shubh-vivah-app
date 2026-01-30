import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PeopleCardProps {
  name: string;
  age: number;
  distance: string;
  matchScore: number;
  image: string;
}

export const PeopleCard = ({
  name,
  age,
  distance,
  matchScore,
  image,
}: PeopleCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {name}, {age}
          </Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{matchScore}%</Text>
          </View>
        </View>
        <Text style={styles.distance}>{distance}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]}>
          <Ionicons
            name="heart-outline"
            size={18}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
  matchBadge: {
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  distance: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
  },
  likeBtn: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
});
