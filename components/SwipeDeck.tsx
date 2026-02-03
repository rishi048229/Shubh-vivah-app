import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import ProfileCard from "./ProfileCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  image: any;
  bio?: string;
  matchPercentage?: number;
}

interface SwipeDeckProps {
  profiles: Profile[];
  onSwipeLeft: (profile: Profile) => void;
  onSwipeRight: (profile: Profile) => void;
  renderEmpty?: () => React.ReactNode;
}

export interface SwipeDeckRef {
  rewind: () => void;
  swipeLeft: () => void;
  swipeRight: () => void;
}

const SwipeDeck = forwardRef<SwipeDeckRef, SwipeDeckProps>(
  ({ profiles, onSwipeLeft, onSwipeRight, renderEmpty }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);

    // Track history for rewind
    const [history, setHistory] = React.useState<number[]>([]);

    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    const resetPosition = () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotate.value = withSpring(0);
    };

    const completeSwipe = useCallback(
      (direction: "left" | "right") => {
        const isRight = direction === "right";
        const throwX = isRight ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

        translateX.value = withTiming(throwX, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)(direction);
        });
      },
      [currentIndex],
    ); // Added currentIndex for safety, though strictly not needed for the animation value itself

    const handleSwipeComplete = (direction: "left" | "right") => {
      const profile = profiles[currentIndex];

      // Add to history
      setHistory((prev) => [...prev, currentIndex]);

      if (direction === "left") {
        onSwipeLeft(profile);
      } else {
        onSwipeRight(profile);
      }

      setCurrentIndex((prev) => prev + 1);

      // Reset values immediately for the next card (which is now visible)
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
    };

    const undoSwipe = () => {
      if (history.length === 0) return;

      const lastIndex = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      setHistory(newHistory);
      setCurrentIndex(lastIndex);

      // Could add an animation here for the card coming back
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      rotate.value = withTiming(0, { duration: 300 });
    };

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      rewind: undoSwipe,
      swipeLeft: () => completeSwipe("left"),
      swipeRight: () => completeSwipe("right"),
    }));

    const gesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        rotate.value = interpolate(
          event.translationX,
          [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
          [-15, 15],
          Extrapolation.CLAMP,
        );
      })
      .onEnd((event) => {
        if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
          runOnJS(completeSwipe)(event.translationX > 0 ? "right" : "left");
        } else {
          runOnJS(resetPosition)();
        }
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` },
        ],
      };
    });

    const nextCardStyle = useAnimatedStyle(() => {
      // Scale the next card up as the current one moves away
      const scale = interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH],
        [0.9, 1],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ scale }],
        opacity: interpolate(
          Math.abs(translateX.value),
          [0, SCREEN_WIDTH * 0.5],
          [0.8, 1],
          Extrapolation.CLAMP,
        ),
      };
    });

    if (currentIndex >= profiles.length) {
      return renderEmpty ? (
        <>{renderEmpty()}</>
      ) : (
        <View style={styles.center}>
          <Text>No more profiles!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Next Card (Background) */}
        {nextProfile && (
          <Animated.View
            style={[styles.cardContainer, styles.nextCard, nextCardStyle]}
          >
            <ProfileCard profile={nextProfile} />
          </Animated.View>
        )}

        {/* Current Card (Foreground) */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <ProfileCard profile={currentProfile} />

            {/* Overlay Labels (Like/Nope) could go here */}
          </Animated.View>
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.35, // Aspect ratio ~ 2:3
    position: "absolute",
    borderRadius: 20,
    // Add shadow/elevation here if needed, but ProfileCard has it too
    zIndex: 100,
  },
  nextCard: {
    zIndex: 90,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SwipeDeck;
