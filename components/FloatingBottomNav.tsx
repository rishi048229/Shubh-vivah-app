import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FloatingBottomNavProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
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

            const iconName = options.tabBarIconName || "ellipse";

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                <AnimatedIcon name={iconName} focused={isFocused} />
                {isFocused && (
                  <Text style={styles.label}>
                    {options.title || route.name}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const AnimatedIcon = ({ name, focused }: { name: any; focused: boolean }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as any)}
        size={24}
        color={focused ? Colors.light.gold : Colors.light.ivory}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  blurContainer: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.gold, // Gold border
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.light.maroon, // Maroon background
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-around",
    width: "100%",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  label: {
    fontSize: 10,
    color: Colors.light.gold, // Gold text
    marginTop: 2,
    fontWeight: "600",
  },
});
