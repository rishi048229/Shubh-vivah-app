import { Colors } from "@/constants/Colors";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const STORIES = [
  {
    id: 1,
    name: "Anjali Sharma",
    text: "I found genuine and compatible matches on this app. The process was simple, safe, and helped me connect with the right people.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "red",
  },
  {
    id: 2,
    name: "Rahul & Priya",
    text: "Shubh Vivah helped us find each other when we least expected it. Highly recommended!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "cream",
  },
  {
    id: 3,
    name: "Sohan Singh",
    text: "Great experience and amazing support team.",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
    type: "red",
  },
];

export default function SuccessStories() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Success Stories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STORIES.map((story) => (
          <View
            key={story.id}
            style={[
              styles.card,
              story.type === "red" ? styles.redCard : styles.creamCard,
            ]}
          >
            <Text
              style={[
                styles.title,
                story.type === "red" ? styles.textWhite : styles.textDark,
              ]}
            >
              Success Story
            </Text>
            <View style={styles.contentRow}>
              <Image source={{ uri: story.img }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.quote,
                    story.type === "red" ? styles.textWhite : styles.textDark,
                  ]}
                  numberOfLines={4}
                >
                  "{story.text}"
                </Text>
                <Text
                  style={[
                    styles.author,
                    story.type === "red" ? styles.textWhite : styles.textDark,
                  ]}
                >
                  -{story.name}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.maroon,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    width: width * 0.75,
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  redCard: {
    backgroundColor: "#C21807",
  },
  creamCard: {
    backgroundColor: "#FEFDF5",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "serif",
  },
  contentRow: {
    flexDirection: "row",
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    flex: 1,
  },
  quote: {
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: 5,
  },
  author: {
    fontSize: 12,
    fontWeight: "bold",
  },
  textWhite: {
    color: "#FFF",
  },
  textDark: {
    color: "#000",
  },
});
