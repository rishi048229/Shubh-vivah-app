import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface ActionCenterButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

export default function ActionCenterButton({
  icon,
  label,
  onPress,
  color = "#800000",
}: ActionCenterButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPress();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <View style={styles.innerShadow}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 8,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FDF5E6", // OldLace/Ivory
    justifyContent: "center",
    alignItems: "center",
    // Neumorphic Outer Shadow (Light source top-left)
    shadowColor: "#D1C4B0", // Darker shadow
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
    // Note: React Native distinct shadow support is limited, so we simulate main depth here
  },
  innerShadow: {
    // Inner Concave look simulated with border/bg
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF9F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  label: {
    fontSize: 12,
    color: "#5C4033",
    fontWeight: "600",
  },
});
