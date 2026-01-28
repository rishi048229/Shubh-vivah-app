import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MATCHES = [
  {
    id: 1,
    name: "Ananya",
    age: 24,
    city: "Mumbai",
    match: 95,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Rohan",
    age: 27,
    city: "Delhi",
    match: 88,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "Priya",
    age: 25,
    city: "Bangalore",
    match: 92,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "Vikram",
    age: 28,
    city: "Pune",
    match: 85,
    image: "https://via.placeholder.com/100",
  },
];

export const MatchFeed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People You May Like</Text>
        <TouchableOpacity>
          <Ionicons
            name="options-outline"
            size={20}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MATCHES.map((match) => (
          <View key={match.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: match.image }} style={styles.image} />
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{match.match}% Match</Text>
              </View>
            </View>

            <Text style={styles.name}>
              {match.name}, {match.age}
            </Text>
            <Text style={styles.city}>{match.city}</Text>

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
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 140,
    alignItems: "center",
    backgroundColor: Colors.light.ivory,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  matchBadge: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  city: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    padding: 6,
    backgroundColor: "rgba(128, 0, 0, 0.05)",
    borderRadius: 20,
  },
});
