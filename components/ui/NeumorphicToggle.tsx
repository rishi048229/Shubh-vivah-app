import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface NeumorphicToggleProps {
  isOn: boolean;
  onToggle: () => void;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

export const NeumorphicToggle: React.FC<NeumorphicToggleProps> = ({
  isOn,
  onToggle,
  width = 60,
  height = 30,
  activeColor = "#4CAF50",
  inactiveColor = "#E0E0E0",
  style,
}) => {
  const offset = useSharedValue(isOn ? 1 : 0);
  const toggleSize = height - 4;
  const traverseDistance = width - toggleSize - 4;

  useEffect(() => {
    offset.value = withSpring(isOn ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [isOn, offset]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value * traverseDistance,
        },
      ],
      backgroundColor: "#FFF",
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.value,
      [0, 1],
      [inactiveColor, activeColor],
    );
    return {
      backgroundColor,
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onToggle}
      style={[
        styles.container,
        { width, height, borderRadius: height / 2 },
        style,
      ]}
    >
      {/* Background with Inner Shadow Effect (Simulated) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.innerShadowContainer,
          { borderRadius: height / 2 },
          containerAnimatedStyle,
        ]}
      />

      {/* Toggle Knob with Soft Shadow */}
      <Animated.View
        style={[
          styles.knob,
          {
            width: toggleSize,
            height: toggleSize,
            borderRadius: toggleSize / 2,
          },
          animatedStyles,
        ]}
      >
        <View style={styles.knobHighlight} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 2,
    // Outer shadow (Light source top-left)
    shadowColor: "#FFF",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  innerShadowContainer: {
    // Inner shadow simulation (Darker bottom-right)
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  knob: {
    position: "absolute",
    left: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  knobHighlight: {
    width: "40%",
    height: "40%",
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    opacity: 0.5,
  },
});
