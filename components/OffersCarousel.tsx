import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const SPACING = 10;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2;

const OFFERS = [
  {
    id: 1,
    title: "Early Bird",
    description: "20% Off",
    image: "https://via.placeholder.com/200x300/FFD700/800000?text=Early+Bird",
  },
  {
    id: 2,
    title: "Couple Pack",
    description: "Free Photos",
    image: "https://via.placeholder.com/200x300/FF6347/FFFFFF?text=Couple+Pack",
  },
  {
    id: 3,
    title: "Referral",
    description: "Earn Rewards",
    image: "https://via.placeholder.com/200x300/4682B4/FFFFFF?text=Referral",
  },
  {
    id: 4,
    title: "Premium",
    description: "VIP Access",
    image: "https://via.placeholder.com/200x300/800080/FFFFFF?text=Premium",
  },
];

export const OffersCarousel: React.FC = () => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Exclusive Offers</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Spacer for centering first item */}
        <View style={{ width: SPACER_WIDTH - SPACING }} />

        {OFFERS.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            index={index}
            scrollX={scrollX}
          />
        ))}

        {/* Spacer for centering last item */}
        <View style={{ width: SPACER_WIDTH - SPACING }} />
      </Animated.ScrollView>
    </View>
  );
};

const OfferCard = ({
  offer,
  index,
  scrollX,
}: {
  offer: any;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      "clamp",
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      "clamp",
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Image source={{ uri: offer.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.offerTitle} numberOfLines={1}>
          {offer.title}
        </Text>
        <Text style={styles.offerDescription} numberOfLines={1}>
          {offer.description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginLeft: 20,
    marginBottom: 15,
  },
  scrollContent: {
    // Padding handled by spacers
  },
  card: {
    width: CARD_WIDTH,
    height: 300, // Taller for vertical look
    borderRadius: 20,
    marginRight: SPACING,
    backgroundColor: Colors.light.ivory,
    overflow: "hidden",
    // No border as requested
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 240, // Takes up most of the card
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  offerDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
  },
});
