import { MatchProfile } from "@/types/connections";
import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import BestMatchCard from "./BestMatchCard";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75; // Card width
const SPACING = 10;
const ITEM_SIZE = ITEM_WIDTH + SPACING; // Snap interval
const SPACER_WIDTH = (width - ITEM_SIZE) / 2;

interface BestMatchesCarouselProps {
  matches: MatchProfile[];
  onMatchPress: (profile: MatchProfile) => void;
}

export default function BestMatchesCarousel({
  matches,
  onMatchPress,
}: BestMatchesCarouselProps) {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll Handler
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Track active index for accessibility/logic
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      // The spacer is index 0, so the first match is index 1.
      // We want the match index relative to the data array.
      // However, since we added a spacer at start, index 1 corresponds to matches[0].
      // Let's just track the raw index if needed, or adjust.
      // Ideally rely on the visual snap.
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  // Render Item Component
  const RenderItem = ({
    item,
    index,
  }: {
    item: MatchProfile;
    index: number;
  }) => {
    // Spacer check
    if (!item.id) {
      return <View style={{ width: SPACER_WIDTH }} />;
    }

    // Animation Style
    const style = useAnimatedStyle(() => {
      // Input Range: [Previous Item, Current Item, Next Item]
      const inputRange = [
        (index - 2) * ITEM_SIZE,
        (index - 1) * ITEM_SIZE, // Center
        index * ITEM_SIZE,
      ];

      // 1. Scale: Center = 1, Sides = 0.85
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.85, 1, 0.85],
        Extrapolation.CLAMP,
      );

      // 2. Opacity: Center = 1, Sides = 0.6
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP,
      );

      // 3. 3D Rotation (RotateY)
      // Left item rotates OUT (+deg), Right item rotates OUT (-deg) or vice versa depending on perspective
      const rotateY = interpolate(
        scrollX.value,
        inputRange,
        [45, 0, -45], // Degrees
        Extrapolation.CLAMP,
      );

      // 4. TranslateX (Perspective Shift) - Optional to pull them closer
      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [-20, 0, 20], // Pull items closer to overlap slightly
        Extrapolation.CLAMP,
      );

      return {
        transform: [
          { perspective: 1000 },
          { translateX },
          { rotateY: `${rotateY}deg` },
          { scale },
        ],
        opacity,
        zIndex: index === activeIndex ? 10 : 0, // Ensure center is on top if overlapping
      };
    });

    return (
      <Animated.View style={[styles.itemContainer, style]}>
        <BestMatchCard
          profile={item}
          onPress={() => onMatchPress(item)}
          isActive={true} // Always "active" visually, animations handle focus
        />
      </Animated.View>
    );
  };

  // Prepare data with spacers
  const data = [
    { id: "" } as MatchProfile, // Leading Spacer
    ...matches,
    { id: "" } as MatchProfile, // Trailing Spacer
  ];

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RenderItem item={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer}
        // viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        // onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  itemContainer: {
    width: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
