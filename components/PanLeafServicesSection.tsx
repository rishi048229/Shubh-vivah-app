import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
    type SharedValue
} from "react-native-reanimated";
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;
const SPACING = 10;
const SIDE_CARD_WIDTH = (width - CARD_WIDTH) / 2;

const SERVICES = [
  {
    id: 1,
    name: "Photography",
    icon: "camera-outline",
    desc: "Capture moments",
  },
  { id: 2, name: "Venue", icon: "business-outline", desc: "Perfect locations" },
  {
    id: 3,
    name: "Catering",
    icon: "restaurant-outline",
    desc: "Delicious feasts",
  },
  { id: 4, name: "Decoration", icon: "rose-outline", desc: "Beautiful decor" },
  {
    id: 5,
    name: "Music",
    icon: "musical-notes-outline",
    desc: "Soulful tunes",
  },
  { id: 6, name: "Astrology", icon: "moon-outline", desc: "Divine guidance" },
];

export const PanLeafServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const isAutoPlaying = useSharedValue(true);

  // Auto-rotation logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlaying.value) {
        const nextIndex = (activeIndex + 1) % SERVICES.length;
        scrollToIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    translateX.value = withSpring(-index * (CARD_WIDTH + SPACING), {
      damping: 20,
      stiffness: 90,
    });
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isAutoPlaying.value = false;
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
    })
    .onEnd((event) => {
      const offset = event.translationX;
      const velocity = event.velocityX;
      let nextIndex = activeIndex;

      if (offset < -50 || velocity < -500) {
        nextIndex = Math.min(activeIndex + 1, SERVICES.length - 1);
      } else if (offset > 50 || velocity > 500) {
        nextIndex = Math.max(activeIndex - 1, 0);
      }

      runOnJS(scrollToIndex)(nextIndex);
      isAutoPlaying.value = true;
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.headerTitle}>Our Services</Text>
      <View style={styles.carouselContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.track,
              useAnimatedStyle(() => ({
                transform: [{ translateX: translateX.value }],
              })),
            ]}
          >
            {SERVICES.map((service, index) => {
              return (
                <LeafCard
                  key={service.id}
                  service={service}
                  index={index}
                  translateX={translateX}
                  isActive={index === activeIndex}
                />
              );
            })}
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {SERVICES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const LeafCard = ({
  service,
  index,
  translateX,
  isActive,
}: {
  service: any;
  index: number;
  translateX: SharedValue<number>;
  isActive: boolean;
}) => {
  const inputRange = [
    -(index + 1) * (CARD_WIDTH + SPACING),
    -index * (CARD_WIDTH + SPACING),
    -(index - 1) * (CARD_WIDTH + SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0.8, 1.1, 0.8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [-10, 0, 10],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      opacity,
      zIndex: isActive ? 10 : 1,
    };
  });

  // Breathing animation for active leaf
  const breathingScale = useSharedValue(1);
  useEffect(() => {
    if (isActive) {
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      breathingScale.value = withTiming(1);
    }
  }, [isActive]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Animated.View style={[styles.leafWrapper, breathingStyle]}>
        {/* Realistic Pan Leaf SVG */}
        <Svg
          width={CARD_WIDTH}
          height={CARD_WIDTH * 1.3}
          viewBox="0 0 200 260"
          style={styles.shadow}
        >
          <Defs>
            <LinearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#2E7D32" stopOpacity="1" />
              <Stop offset="1" stopColor="#1B5E20" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#81C784" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#66BB6A" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Main Leaf Body - Heart/Betel shape */}
          <Path
            d="M100,250 C100,250 20,180 20,100 C20,40 60,10 100,30 C140,10 180,40 180,100 C180,180 100,250 100,250 Z"
            fill="url(#leafGrad)"
            stroke="#1B5E20"
            strokeWidth="1"
          />

          {/* Central Vein */}
          <Path
            d="M100,30 Q105,140 100,250"
            stroke="url(#veinGrad)"
            strokeWidth="2"
            fill="none"
          />

          {/* Side Veins (Left) */}
          <Path
            d="M100,60 Q70,50 40,70"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,100 Q60,90 30,120"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,140 Q70,130 40,160"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,180 Q80,170 60,190"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />

          {/* Side Veins (Right) */}
          <Path
            d="M100,60 Q130,50 160,70"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,100 Q140,90 170,120"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,140 Q130,130 160,160"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M100,180 Q120,170 140,190"
            stroke="url(#veinGrad)"
            strokeWidth="1"
            fill="none"
          />
        </Svg>

        {/* Content Overlay */}
        <View style={styles.contentContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name={service.icon} size={32} color={Colors.light.gold} />
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDesc}>{service.desc}</Text>

          {/* Diya/Dot Indicator */}
          {isActive && (
            <View style={styles.activeIndicator}>
              <Svg height="20" width="20" viewBox="0 0 20 20">
                <Circle cx="10" cy="10" r="4" fill={Colors.light.gold} />
                <Circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke={Colors.light.gold}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </Svg>
            </View>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 20,
    fontFamily: "GreatVibes-Regular", // Assuming this font is loaded
  },
  carouselContainer: {
    height: CARD_WIDTH * 1.4,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: (width - CARD_WIDTH) / 2, // Center the first item
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    alignItems: "center",
    justifyContent: "center",
  },
  leafWrapper: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  shadow: {
    // Shadow is handled by the wrapper view for elevation support
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40, // Push content down a bit
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)", // Soft gold border
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.ivory,
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  serviceDesc: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    maxWidth: "70%",
  },
  activeIndicator: {
    marginTop: 10,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.light.maroon,
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});
