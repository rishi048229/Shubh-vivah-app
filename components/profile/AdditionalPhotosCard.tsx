import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOut, ZoomIn } from "react-native-reanimated";

const MAX_PHOTOS = 5;

export const AdditionalPhotosCard = () => {
  const { additionalPhotos, addPhoto, removePhoto } = useProfile();
  const remainingSlots = MAX_PHOTOS - additionalPhotos.length;

  const handleAddPhoto = async () => {
    if (additionalPhotos.length >= MAX_PHOTOS) {
      Alert.alert(
        "Limit Reached",
        "You can add up to 5 photos only. Delete one to add a new photo.",
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const success = await addPhoto(result.assets[0].uri);
      if (!success) {
        Alert.alert("Error", "Could not add photo. Maximum 5 photos allowed.");
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removePhoto(index),
      },
    ]);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="images-outline" size={18} color={Colors.light.gold} />
          <Text style={styles.title}>Additional Photos</Text>
        </View>
        <Text style={styles.counter}>
          {additionalPhotos.length}/{MAX_PHOTOS}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Add up to 5 photos to showcase yourself better
      </Text>

      <View style={styles.photosGrid}>
        {/* Existing Photos */}
        {additionalPhotos.map((uri, index) => (
          <Animated.View
            key={uri}
            entering={ZoomIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.photoWrapper}
          >
            <Image source={{ uri }} style={styles.photo} contentFit="cover" />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleRemovePhoto(index)}
            >
              <Ionicons name="close" size={14} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Add Photo Button (if slots available) */}
        {remainingSlots > 0 && (
          <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
            <View style={styles.addIcon}>
              <Ionicons name="add" size={28} color={Colors.light.maroon} />
            </View>
            <Text style={styles.addText}>Add Photo</Text>
          </TouchableOpacity>
        )}

        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, remainingSlots - 1) }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.emptySlot}>
            <Ionicons name="image-outline" size={24} color="#DDD" />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.maroon,
  },
  counter: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.gold,
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoWrapper: {
    width: "30%",
    aspectRatio: 0.8,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoBtn: {
    width: "30%",
    aspectRatio: 0.8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.maroon,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.lightMaroon,
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  addText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
  emptySlot: {
    width: "30%",
    aspectRatio: 0.8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
});
