import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { MOCK_PROFILES } from "./mockData";
import ProfileCard from "./ProfileCard";

const { width, height } = Dimensions.get("window");
// Threshold for a swipe to act as an action
const SWIPE_THRESHOLD = width * 0.3;

export default function SwipeDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const profiles = MOCK_PROFILES;

  // Shared values for the ACTIVE card
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Called when a swipe is completed
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length); // Loop for demo
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
  }, [profiles.length, translateX, translateY, scale]);

  // Gesture definitions
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY; // Allow some vertical movement
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        // Swipe Left or Right
        const direction = Math.sign(e.translationX); // 1 = right, -1 = left
        translateX.value = withSpring(direction * width * 1.5, {}, () => {
          runOnJS(handleNext)();
        });
      } else if (e.translationY < -SWIPE_THRESHOLD * 0.8) {
        // Swipe Up (Details) - For now just skip animation loop
        // In real app, this would open modal
        translateY.value = withSpring(-height, {}, () => {
          runOnJS(handleNext)();
        });
      } else {
        // Reset
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Animation Styles for the TOP card
  const topCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10],
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  // Animation Styles for the NEXT card (Background)
  const nextCardStyle = useAnimatedStyle(() => {
    // As top card moves away, next card scales UP
    const currentMsg = Math.abs(translateX.value);
    const nextScale = interpolate(currentMsg, [0, width], [0.9, 1]);
    const nextY = interpolate(
      currentMsg,
      [0, width],
      [30, 0], // Move up from behind
    );

    return {
      transform: [{ scale: nextScale }, { translateY: nextY }],
      opacity: interpolate(currentMsg, [0, width], [0.6, 1]),
    };
  });

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.center}>
        <Text>No more profiles!</Text>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];
  // Calculate next index looping for demo
  const nextIndex = (currentIndex + 1) % profiles.length;
  const nextProfile = profiles[nextIndex];

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.deckContainer}>
        {/* Next Card (Background) */}
        {nextProfile && (
          <Animated.View
            style={[styles.cardWrapper, nextCardStyle, { zIndex: 0 }]}
          >
            <ProfileCard profile={nextProfile} />
          </Animated.View>
        )}

        {/* Top Card (Foreground + Gestures) */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.cardWrapper, topCardStyle, { zIndex: 10 }]}
          >
            <ProfileCard profile={currentProfile} />

            {/* Visual Feedback Overlays could go here */}
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => {
            translateX.value = withSpring(-width * 1.5, {}, () =>
              runOnJS(handleNext)(),
            );
          }}
        >
          <Ionicons name="close" size={32} color="#FF4D4D" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => {
            translateY.value = withSpring(-height, {}, () =>
              runOnJS(handleNext)(),
            );
          }}
        >
          <Ionicons name="star" size={24} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => {
            translateX.value = withSpring(width * 1.5, {}, () =>
              runOnJS(handleNext)(),
            );
          }}
        >
          <Ionicons name="heart" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <Text style={styles.hintText}>Swipe Up for Details</Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deckContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: width,
    height: height * 0.7,
  },
  cardWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
    marginBottom: 20,
    marginTop: 10,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: "#FF4D4D",
  },
  likeButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  superLikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10, // Visual offset
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  hintText: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 20,
  },
});
