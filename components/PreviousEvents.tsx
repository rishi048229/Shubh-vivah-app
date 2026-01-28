import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const EVENTS = [
  {
    id: 1,
    title: "Royal Wedding in Jaipur",
    date: "Dec 2023",
    image: require("@/assets/images/Irina and Dhruv, Jaipur.jpg"),
  },
  {
    id: 2,
    title: "Destination Wedding in Goa",
    date: "Nov 2023",
    image: require("@/assets/images/download (19).jpg"),
  },
  {
    id: 3,
    title: "Traditional Ceremony in Varanasi",
    date: "Oct 2023",
    image: require("@/assets/images/download (8).jpg"),
  },
];

export const PreviousEvents: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Previous Events</Text>
        <Text style={styles.subtitle}>Memorable moments we helped create</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {EVENTS.map((event) => (
          <View key={event.id} style={styles.card}>
            <Image source={event.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.dateContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.light.text}
                />
                <Text style={styles.dateText}>{event.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.6,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: 280,
    marginRight: 16,
    backgroundColor: Colors.light.ivory,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  image: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
});
