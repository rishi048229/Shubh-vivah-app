import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

interface CustomSliderProps {
  min: number;
  max: number;
  initialMin?: number;
  initialMax?: number;
  onValueChange?: (min: number, max: number) => void;
}

const TRACK_WIDTH = Dimensions.get("window").width - 80;
const THUMB_SIZE = 24;

export default function CustomSlider({
  min,
  max,
  initialMin,
  initialMax,
  onValueChange,
}: CustomSliderProps) {
  const startX = useSharedValue(0); // For left thumb
  const endX = useSharedValue(TRACK_WIDTH); // For right thumb

  // Context for gestures
  const context = useSharedValue({ startX: 0, endX: 0 });

  // Update logic to map position to value
  const updateValues = () => {
    const range = max - min;
    const minVal = Math.round(min + (startX.value / TRACK_WIDTH) * range);
    const maxVal = Math.round(min + (endX.value / TRACK_WIDTH) * range);
    if (onValueChange) {
      onValueChange(minVal, maxVal);
    }
  };

  const leftGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startX: startX.value, endX: endX.value };
    })
    .onUpdate((event) => {
      let newX = context.value.startX + event.translationX;
      if (newX < 0) newX = 0;
      if (newX > endX.value - THUMB_SIZE) newX = endX.value - THUMB_SIZE;
      startX.value = newX;
      runOnJS(updateValues)();
    });

  const rightGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startX: startX.value, endX: endX.value };
    })
    .onUpdate((event) => {
      let newX = context.value.endX + event.translationX;
      if (newX < startX.value + THUMB_SIZE) newX = startX.value + THUMB_SIZE;
      if (newX > TRACK_WIDTH) newX = TRACK_WIDTH;
      endX.value = newX;
      runOnJS(updateValues)();
    });

  const leftThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: startX.value }],
  }));

  const rightThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: endX.value }],
  }));

  const trackHighlightStyle = useAnimatedStyle(() => ({
    left: startX.value,
    width: endX.value - startX.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track} />
      <Animated.View style={[styles.trackHighlight, trackHighlightStyle]} />

      <GestureDetector gesture={leftGesture}>
        <Animated.View style={[styles.thumb, leftThumbStyle]}>
          <View style={styles.thumbInner} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={rightGesture}>
        <Animated.View style={[styles.thumb, rightThumbStyle]}>
          <View style={styles.thumbInner} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    width: TRACK_WIDTH + THUMB_SIZE,
  },
  track: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    width: TRACK_WIDTH,
    position: "absolute",
    left: THUMB_SIZE / 2,
  },
  trackHighlight: {
    height: 4,
    backgroundColor: Colors.light.maroon,
    borderRadius: 2,
    position: "absolute",
    left: THUMB_SIZE / 2, // offset by startX.value via animated style
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    position: "absolute",
    left: 0, // Animated
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  thumbInner: {
    width: THUMB_SIZE / 2,
    height: THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 4,
    backgroundColor: Colors.light.maroon,
  },
});
