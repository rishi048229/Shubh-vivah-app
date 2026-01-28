import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Services mapped to leaf positions (approximate angles/radii based on the image)
const SERVICES = [
  {
    id: 1,
    name: "Photography",
    icon: "camera-outline",
    angle: -150,
    radius: 140,
  },
  { id: 2, name: "Venue", icon: "business-outline", angle: -120, radius: 150 },
  {
    id: 3,
    name: "Catering",
    icon: "restaurant-outline",
    angle: -90,
    radius: 160,
  }, // Top center
  { id: 4, name: "Decoration", icon: "rose-outline", angle: -60, radius: 150 },
  {
    id: 5,
    name: "Music",
    icon: "musical-notes-outline",
    angle: -30,
    radius: 140,
  },
];

export const ServicesKalashSection: React.FC = () => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(500, withSpring(1, { damping: 20 }));
  }, []);

  const kalashStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [100, 0]) },
        { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
      ],
      opacity: progress.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Services</Text>

      <View style={styles.kalashContainer}>
        {/* Central Kalash Image */}
        <Animated.View style={[styles.kalashWrapper, kalashStyle]}>
          <Image
            source={require("@/assets/images/kalash.jpg")}
            style={styles.kalashImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Service Icons on Leaves */}
        {SERVICES.map((service, index) => {
          const angleRad = (service.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * service.radius;
          const y = Math.sin(angleRad) * service.radius + 50; // Offset downwards to align with leaves

          const itemStyle = useAnimatedStyle(() => {
            const scale = interpolate(progress.value, [0, 1], [0, 1]);
            return {
              transform: [{ translateX: x }, { translateY: y }, { scale }],
              opacity: progress.value,
            };
          });

          return (
            <Animated.View
              key={service.id}
              style={[styles.serviceItem, itemStyle]}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={service.icon as any}
                  size={20}
                  color={Colors.light.maroon}
                />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 100,
    minHeight: 400, // Increased height for the image
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 20,
  },
  kalashContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: 350,
  },
  kalashWrapper: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Image behind icons? Or icons on top? Icons on top.
  },
  kalashImage: {
    width: "100%",
    height: "100%",
  },
  serviceItem: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2, // Icons on top of image
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 240, 0.9)", // Semi-transparent ivory
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.gold,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 10,
    color: Colors.light.maroon,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Background for readability
    paddingHorizontal: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
});
