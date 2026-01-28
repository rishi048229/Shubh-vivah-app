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

const SHORTLISTED = [
  { id: 1, image: "https://via.placeholder.com/100" },
  { id: 2, image: "https://via.placeholder.com/100" },
  { id: 3, image: "https://via.placeholder.com/100" },
  { id: 4, image: "https://via.placeholder.com/100" },
  { id: 5, image: "https://via.placeholder.com/100" },
];

export const ShortlistStrip = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shortlisted Profiles</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SHORTLISTED.map((item) => (
          <TouchableOpacity key={item.id} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Ionicons name="heart" size={12} color={Colors.light.maroon} />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addItem}>
          <Ionicons name="add" size={24} color={Colors.light.gold} />
        </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  viewAll: {
    fontSize: 12,
    color: Colors.light.gold,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  item: {
    position: "relative",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.light.gold,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.ivory,
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  addItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 215, 0, 0.05)",
  },
});
