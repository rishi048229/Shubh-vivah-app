import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export const KundaliInsightPanel = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.bgDecoration}>
          <Animated.View style={[styles.ring, animatedStyle]}>
            <Ionicons
              name="sunny-outline"
              size={100}
              color="rgba(255, 215, 0, 0.1)"
            />
          </Animated.View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="planet" size={20} color={Colors.light.gold} />
            <Text style={styles.title}>Cosmic Insights</Text>
          </View>

          <Text style={styles.insightText}>
            "Strong Venus alignment suggests a favorable time for new
            connections this week."
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Horoscope</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.outlineButton]}>
              <Text style={[styles.buttonText, styles.outlineText]}>
                Upload Kundali
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.maroon,
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },
  bgDecoration: {
    position: "absolute",
    right: -30,
    top: -30,
  },
  ring: {
    opacity: 0.5,
  },
  content: {
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
  insightText: {
    fontSize: 14,
    color: Colors.light.ivory,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: Colors.light.gold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  outlineText: {
    color: Colors.light.gold,
  },
});
