import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");

const SERVICES = [
  {
    id: 1,
    title: "Matchmaking",
    icon: "heart-outline",
    desc: "Finding your soulmate",
  },
  {
    id: 2,
    title: "Astrology",
    icon: "moon-outline",
    desc: "Aligning stars for you",
  },
  {
    id: 3,
    title: "Venue",
    icon: "business-outline",
    desc: "Perfect setting for vows",
  },
  {
    id: 4,
    title: "Decoration",
    icon: "rose-outline",
    desc: "Adorning your special day",
  },
  {
    id: 5,
    title: "Catering",
    icon: "restaurant-outline",
    desc: "Feasts to remember",
  },
  {
    id: 6,
    title: "Photography",
    icon: "camera-outline",
    desc: "Capturing eternal moments",
  },
];

const CARD_HEIGHT = 100;
const SPACING = 20;
const TOTAL_HEIGHT = SERVICES.length * (CARD_HEIGHT + SPACING) + 100;

export const RitualPathServicesSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Sacred Journey</Text>
      <Text style={styles.subHeader}>Your path to a beautiful union</Text>

      <View style={styles.contentContainer}>
        {/* Background Path */}
        <View style={styles.pathContainer}>
          <Svg height={TOTAL_HEIGHT} width={width} style={styles.svgPath}>
            <Defs>
              <LinearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0"
                  stopColor={Colors.light.gold}
                  stopOpacity="0.2"
                />
                <Stop
                  offset="0.5"
                  stopColor={Colors.light.gold}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={Colors.light.gold}
                  stopOpacity="0.2"
                />
              </LinearGradient>
            </Defs>
            {/* The Golden Thread */}
            <Path
              d={`M${width / 2},0 Q${width / 2 + 20},${TOTAL_HEIGHT / 4} ${
                width / 2
              },${TOTAL_HEIGHT / 2} T${width / 2},${TOTAL_HEIGHT}`}
              stroke="url(#goldGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5, 5"
            />
          </Svg>
        </View>

        {/* Service Cards */}
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </View>
    </View>
  );
};

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const isLeft = index % 2 === 0;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(
      index * 300,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      index * 300,
      withSpring(0, { damping: 12, stiffness: 90 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        isLeft ? styles.leftCard : styles.rightCard,
        animatedStyle,
      ]}
    >
      {/* Connector Dot on the Path */}
      <View
        style={[styles.connectorDot, isLeft ? styles.dotRight : styles.dotLeft]}
      >
        <View style={styles.innerDot} />
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name={service.icon} size={24} color={Colors.light.gold} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceDesc}>{service.desc}</Text>
        </View>
        {/* Decorative Diya Icon at bottom right */}
        <View style={styles.diyaContainer}>
          <Svg height="12" width="12" viewBox="0 0 20 20">
            <Circle
              cx="10"
              cy="10"
              r="4"
              fill={Colors.light.gold}
              opacity="0.6"
            />
          </Svg>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    backgroundColor: Colors.light.ivory,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.maroon,
    textAlign: "center",
    // fontFamily: "GreatVibes-Regular",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  contentContainer: {
    position: "relative",
    paddingBottom: 40,
  },
  pathContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 0,
  },
  svgPath: {
    opacity: 0.6,
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING,
    width: width,
    position: "relative",
    height: CARD_HEIGHT,
  },
  leftCard: {
    justifyContent: "flex-start",
    paddingLeft: 20,
    paddingRight: width / 2 + 10,
  },
  rightCard: {
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingLeft: width / 2 + 10,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 240, 0.7)", // Glassmorphic Ivory
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)", // Soft Gold Border
    shadowColor: "#8B4513", // Warm shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height: "100%",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128, 0, 0, 0.05)", // Very light maroon
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 10,
    color: "#777",
  },
  connectorDot: {
    position: "absolute",
    top: "50%",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.ivory,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    marginTop: -6,
  },
  dotRight: {
    right: width / 2 - 6,
  },
  dotLeft: {
    left: width / 2 - 6,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.gold,
  },
  diyaContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
});
