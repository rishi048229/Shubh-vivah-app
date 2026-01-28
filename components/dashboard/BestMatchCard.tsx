import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const BestMatchCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={Colors.light.gold} />
        <Text style={styles.headerTitle}>Today's Best Match</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Placeholder for now, can be replaced
            style={styles.profileImage}
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchScore}>92%</Text>
            <Text style={styles.matchLabel}>Match</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>Priya Sharma, 26</Text>
          <Text style={styles.location}>Mumbai, Maharashtra</Text>

          <View style={styles.reasonsContainer}>
            <ReasonBadge icon="location-outline" label="Same City" />
            <ReasonBadge icon="star-outline" label="Kundali Matched" />
          </View>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ReasonBadge = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.reasonBadge}>
    <Ionicons name={icon} size={10} color={Colors.light.maroon} />
    <Text style={styles.reasonText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  card: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    gap: 16,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.light.gold,
  },
  matchBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.light.maroon,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.ivory,
  },
  matchScore: {
    color: Colors.light.gold,
    fontSize: 10,
    fontWeight: "bold",
  },
  matchLabel: {
    color: Colors.light.ivory,
    fontSize: 6,
    textTransform: "uppercase",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  location: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  reasonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reasonText: {
    fontSize: 10,
    color: Colors.light.maroon,
  },
  ctaButton: {
    backgroundColor: Colors.light.gold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  ctaText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
