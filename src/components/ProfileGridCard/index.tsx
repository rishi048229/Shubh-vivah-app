import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
// 2 columns, so width is roughly half minus padding
const CARD_WIDTH = (width - 60) / 2;

interface ProfileGridCardProps {
  id: string;
  name: string;
  age: string;
  job: string;
  imageUri: string;
}

export default function ProfileGridCard({
  id,
  name,
  age,
  job,
  imageUri,
}: ProfileGridCardProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {name}, {age}
        </Text>
        <Text style={styles.job} numberOfLines={1}>
          {job}
        </Text>

        <View style={styles.actions}>
          <Ionicons name="heart" size={18} color="#D32F2F" />
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color="#D32F2F"
          />
          <Ionicons name="star-outline" size={18} color="#D32F2F" />
        </View>

        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() =>
            router.push({ pathname: "/profile/[id]", params: { id } })
          }
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF8E7", // Light creamy bg
    borderRadius: 20, // Rounded corners for the whole card
    overflow: "hidden", // Ensures image respects border radius
    marginBottom: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 180, // Taller image for immersive feel
  },
  image: {
    width: "100%",
    height: "100%",
    // No specific border radius here because the container has overflow: hidden
  },
  infoContainer: {
    padding: 12,
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 4,
  },
  job: {
    fontSize: 11,
    color: "#666", // Gray
    textAlign: "center",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
  viewProfileButton: {
    backgroundColor: "#C21807", // Red
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  viewProfileText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});
