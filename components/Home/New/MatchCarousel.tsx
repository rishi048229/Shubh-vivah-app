import { MatchProfile } from "@/types/connections";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import HeroMatchCard, { CARD_WIDTH, SPACING } from "./HeroMatchCard";

const { width } = Dimensions.get("window");

interface MatchCarouselProps {
  matches: MatchProfile[];
  onMatchPress: (match: MatchProfile) => void;
}

export default function MatchCarousel({
  matches,
  onMatchPress,
}: MatchCarouselProps) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {matches.map((item, index) => {
          return (
            <HeroMatchCard
              key={item.id}
              profile={item}
              index={index}
              scrollX={scrollX}
              onPress={() => onMatchPress(item)}
            />
          );
        })}
        {/* Spacer for last item centring */}
        <View style={{ width: (width - CARD_WIDTH) / 2 - SPACING }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2, // Center first item
  },
});
