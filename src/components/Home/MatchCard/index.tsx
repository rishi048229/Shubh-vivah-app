import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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
const CARD_WIDTH = width * 0.42; // Approx 40-45% of screen width

interface MatchCardProps {
  name: string;
  age: string;
  job: string;
  imageUri: string;
}

import { useRouter } from "expo-router";

export default function MatchCard({
  name,
  age,
  job,
  imageUri,
}: MatchCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/profile/[id]", params: { id: 1 } })
      }
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {name} , {age}
        </Text>
        <Text style={styles.job} numberOfLines={1}>
          {job}
        </Text>

        {/* Actions Row */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart" size={16} color="#D32F2F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color="#D32F2F"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="star-outline" size={16} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF8E7", // Light creamy bg from screenshot
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EBD8B2", // Subtle border
    marginRight: 15,
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
    height: 160,
    padding: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  job: {
    fontSize: 10,
    color: Colors.subtext,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    // Hit slop could be added here
  },
});
