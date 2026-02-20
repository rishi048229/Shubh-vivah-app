import { MatchProfile } from "@/types/connections";
import React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import MatchCard, { SNAP_INTERVAL } from "./MatchCard";

const { width } = Dimensions.get("window");

interface MatchCarouselProps {
  profiles: MatchProfile[];
  onProfilePress: (profile: MatchProfile) => void;
  onLikePress?: (profile: MatchProfile) => void;
}

export default function MatchCarousel({
  profiles,
  onProfilePress,
  onLikePress,
}: MatchCarouselProps) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - SNAP_INTERVAL) / 2 + 5, // Center the first card
          paddingVertical: 20,
        }}
      >
        {profiles.map((profile, index) => (
          <MatchCard
            key={profile.id}
            profile={profile}
            index={index}
            scrollX={scrollX}
            onPress={() => onProfilePress(profile)}
            onAction={onProfilePress}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
