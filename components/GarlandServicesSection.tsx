import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const SERVICES = [
  { id: 1, name: "Photography", icon: "camera-outline" },
  { id: 2, name: "Venue", icon: "business-outline" },
  { id: 3, name: "Catering", icon: "restaurant-outline" },
  { id: 4, name: "Decoration", icon: "rose-outline" },
  { id: 5, name: "Music", icon: "musical-notes-outline" },
  { id: 6, name: "Astrology", icon: "moon-outline" },
];

const GARLAND_SEGMENT_WIDTH = 300; // Width of one garland segment
const TOTAL_WIDTH = GARLAND_SEGMENT_WIDTH * 2; // Two segments for looping

export const GarlandServicesSection: React.FC = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-GARLAND_SEGMENT_WIDTH, {
        duration: 10000, // Slow constant speed
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Services</Text>

      <View style={styles.garlandWrapper}>
        <Animated.View style={[styles.garlandContainer, animatedStyle]}>
          {/* First Segment */}
          <GarlandSegment />
          {/* Duplicate Segment for Loop */}
          <GarlandSegment />
          {/* Third Segment to ensure smooth loop on wide screens */}
          <GarlandSegment />
        </Animated.View>
      </View>
    </View>
  );
};

const GarlandSegment = () => {
  return (
    <View style={styles.segment}>
      {/* Garland String and Flowers */}
      <Svg height="100" width={GARLAND_SEGMENT_WIDTH} style={styles.svg}>
        {/* String */}
        <Path
          d={`M0,20 Q${GARLAND_SEGMENT_WIDTH / 2},50 ${GARLAND_SEGMENT_WIDTH},20`}
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
        />
        {/* Marigold Flowers (Simplified as circles for now) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = (GARLAND_SEGMENT_WIDTH / 10) * i + 15;
          const y = 20 + Math.sin((i / 10) * Math.PI) * 15; // Follow curve approx
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r="8"
              fill={i % 2 === 0 ? "#FFA500" : "#FFD700"}
            />
          );
        })}
      </Svg>

      {/* Hanging Mango Leaves with Icons */}
      <View style={styles.leavesContainer}>
        {SERVICES.slice(0, 3).map((service, index) => (
          <MangoLeaf
            key={service.id}
            service={service}
            index={index}
            total={3}
          />
        ))}
      </View>
    </View>
  );
};

const MangoLeaf = ({
  service,
  index,
  total,
}: {
  service: any;
  index: number;
  total: number;
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Distribute leaves along the segment width
  const leftPosition = (GARLAND_SEGMENT_WIDTH / total) * index + 40;

  return (
    <Animated.View
      style={[styles.leafWrapper, animatedStyle, { left: leftPosition }]}
    >
      {/* Mango Leaf Shape (SVG) */}
      <Svg height="120" width="60" viewBox="0 0 60 120">
        <Path
          d="M30,0 Q60,40 30,120 Q0,40 30,0"
          fill="#228B22" // Forest Green
          stroke="#006400"
          strokeWidth="1"
        />
      </Svg>

      {/* Service Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={service.icon} size={20} color={Colors.light.gold} />
        <Text style={styles.serviceName}>{service.name}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 250,
    overflow: "hidden",
    backgroundColor: Colors.light.ivory,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.maroon,
    textAlign: "center",
    marginBottom: 10,
    zIndex: 10,
  },
  garlandWrapper: {
    flexDirection: "row",
    width: "100%",
  },
  garlandContainer: {
    flexDirection: "row",
  },
  segment: {
    width: GARLAND_SEGMENT_WIDTH,
    height: 200,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  leavesContainer: {
    position: "absolute",
    top: 30, // Hang below the garland
    left: 0,
    width: "100%",
    height: "100%",
  },
  leafWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 120,
    top: 0,
  },
  iconContainer: {
    position: "absolute",
    top: 40, // Center in the leaf
    alignItems: "center",
  },
  serviceName: {
    fontSize: 8,
    color: Colors.light.gold,
    marginTop: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
});
