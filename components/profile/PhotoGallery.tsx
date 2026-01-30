import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PhotoGalleryProps {
  images: string[];
  onAddPhoto: () => void;
}

export const PhotoGallery = ({ images, onAddPhoto }: PhotoGalleryProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Photos</Text>
        <TouchableOpacity onPress={onAddPhoto}>
          <Text style={styles.addText}>+ Add Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {/* Add Photo Placeholder */}
        <TouchableOpacity style={styles.addCard} onPress={onAddPhoto}>
          <View style={styles.iconCircle}>
            <Ionicons name="add" size={24} color={Colors.light.maroon} />
          </View>
          <Text style={styles.addCardText}>Upload</Text>
        </TouchableOpacity>

        {/* Images */}
        {images.map((img, index) => (
          <TouchableOpacity key={index} style={styles.imageCard}>
            <Image source={{ uri: img }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  addText: {
    fontSize: 14,
    color: Colors.light.maroon,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  addCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  addCardText: {
    fontSize: 12,
    color: "#666",
  },
  imageCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
