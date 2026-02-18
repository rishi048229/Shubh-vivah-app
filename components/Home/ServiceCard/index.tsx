import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface ServiceCardProps {
  title: string;
  description: string;
  imageUri: string;
  number: string;
  variant?: "red" | "cream";
  onPress?: () => void;
}

export default function ServiceCard({
  title,
  description,
  imageUri,
  number,
  variant = "red",
  onPress,
}: ServiceCardProps) {
  const isRed = variant === "red";

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        {/* 
           Structure:
           We use `flex-direction` to swap sides.
           Default (Red): Text Left, Image Right.
           Cream: Image Left, Text Right.
        */}
        <View style={[styles.cardContent, !isRed && styles.cardContentReverse]}>
          {/* Text Section */}
          <View
            style={[
              styles.textSection,
              isRed ? styles.bgRed : styles.bgCream,
              // Add padding to ensure text doesn't hit the diagonal
              isRed ? { paddingRight: 40 } : { paddingLeft: 40 },
            ]}
          >
            {/* Number Circle */}
            <View
              style={[
                styles.numberCircle,
                isRed ? styles.numberCircleRight : styles.numberCircleLeft,
                { backgroundColor: isRed ? "#FFF" : "#560319" },
              ]}
            >
              <Text
                style={[
                  styles.numberText,
                  { color: isRed ? "#560319" : "#FFF" },
                ]}
              >
                {number}
              </Text>
            </View>

            <Text
              style={[styles.title, isRed ? styles.textWhite : styles.textDark]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.description,
                isRed ? styles.textWhite : styles.textDark,
              ]}
              numberOfLines={4}
            >
              {description}
            </Text>
          </View>

          {/* Image Section */}
          <View style={styles.imageSection}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Diagonal Cut Overlay */}
            <View
              style={[
                styles.diagonalCut,
                isRed ? styles.cutRed : styles.cutCream,
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 180,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden", // Important for shadowing and cutting
    backgroundColor: "#FFF",
    // Shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
  },
  cardContentReverse: {
    flexDirection: "row-reverse", // Swaps Text and Image
  },

  // --- Text Section ---
  textSection: {
    flex: 0.55,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    zIndex: 10, // Ensure Text (and Number Circle) is above Image
  },
  bgRed: {
    backgroundColor: "#560319", // Maroon
  },
  bgCream: {
    backgroundColor: "#FEFDF5",
  },
  textWhite: { color: "#FFF" },
  textDark: { color: "#000" },

  title: {
    fontSize: 20,
    fontFamily: "serif", // Using serif matches the "Event Management" look
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.9,
  },

  // --- Number Circle ---
  numberCircle: {
    position: "absolute",
    top: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // Higher elevation to pop out
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  numberText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  // Positions
  numberCircleRight: {
    right: -16, // Protrude into Image
  },
  numberCircleLeft: {
    left: -16, // Protrude into Image
  },

  // --- Image Section ---
  imageSection: {
    flex: 0.45,
    position: "relative",
    zIndex: 1, // Lower z-index
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // --- Diagonal Cuts ---
  diagonalCut: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    backgroundColor: "transparent",
    zIndex: 5,
  },
  cutRed: {
    left: 0,
    borderTopWidth: 180, // Full Height
    borderRightWidth: 60, // Width of skew
    borderTopColor: "#560319", // Match Text Background (Maroon)
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  cutCream: {
    right: 0,
    borderBottomWidth: 180, // Full Height
    borderLeftWidth: 60, // Width of skew
    borderBottomColor: "#FEFDF5", // Match Text Background
    borderLeftColor: "transparent",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
});
