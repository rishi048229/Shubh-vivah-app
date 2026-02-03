import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
    ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Animated Icon Component
const AnimatedIcon = ({
  name,
  isFocused,
}: {
  name: any;
  isFocused: boolean;
}) => {
  // Shared values for different animations
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      // Trigger specific animations based on icon name
      if (name === "home") {
        // "Gate Opening" -> Scale up and down
        scale.value = withSequence(withTiming(1.2), withTiming(1));
      } else if (name === "person") {
        // "Head Shake" -> Rotate left right
        rotation.value = withSequence(
          withTiming(-15, { duration: 100 }),
          withTiming(15, { duration: 100 }),
          withTiming(-15, { duration: 100 }),
          withTiming(0, { duration: 100 }),
        );
      } else if (name === "people") {
        // "Handshake" -> Horizontal shake / scale
        scale.value = withSequence(withTiming(1.2), withTiming(1));
        translateX.value = withSequence(
          withTiming(2),
          withTiming(-2),
          withTiming(0),
        );
      } else if (name === "chatbubbles") {
        // "Bounce" -> Jump up and down
        translateY.value = withSequence(
          withTiming(-5, { duration: 150 }),
          withSpring(0),
        );
      }
    } else {
      // Reset
      scale.value = withTiming(1);
      rotation.value = withTiming(0);
      translateY.value = withTiming(0);
      translateX.value = withTiming(0);
    }
  }, [isFocused, name]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={name}
        size={24}
        color={isFocused ? Colors.light.gold : "#C08081"} // Gold on Active (Maroon BG), Muted Maroon on Inactive
      />
    </Animated.View>
  );
};

export const CustomBottomNav = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.pillContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Filter out hidden routes
          if (["services", "offers", "events"].includes(route.name)) {
            return null;
          }

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              {/* Active Background Circle */}
              {isFocused && (
                <Animated.View
                  entering={ZoomIn.duration(200)}
                  style={styles.activeCircle}
                />
              )}

              <View style={styles.iconContainer}>
                <AnimatedIcon
                  name={(options as any).tabBarIconName}
                  isFocused={isFocused}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.ivory, // Theme Ivory
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: Colors.light.maroon, // Maroon shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    maxWidth: 350,
    height: 70,
    borderWidth: 1,
    borderColor: "rgba(128, 0, 0, 0.05)", // Subtle maroon border
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  activeCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.maroon, // Theme Maroon for Active
    // Add subtle glow
    shadowColor: Colors.light.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
