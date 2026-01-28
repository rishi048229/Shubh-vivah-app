import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const KundaliCard: React.FC = () => {
  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(800)}
      style={styles.container}
    >
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <View style={styles.content}>
          <Text style={styles.title}>Free Kundali Matching</Text>
          <Text style={styles.subtitle}>
            Find your perfect match with our precise astrological compatibility
            check.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Generate Kundali</Text>
          </TouchableOpacity>
        </View>

        {/* Decorative elements could go here, e.g., zodiac signs */}
        <View style={styles.decorativeCircle} />
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "transparent", // Ensure background is transparent for blur
  },
  blurView: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight white tint
  },
  content: {
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.light.maroon,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: "flex-start",
    shadowColor: Colors.light.maroon,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: Colors.light.ivory,
    fontWeight: "bold",
    fontSize: 16,
  },
  decorativeCircle: {
    position: "absolute",
    right: -30,
    bottom: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.gold,
    opacity: 0.2,
  },
});
