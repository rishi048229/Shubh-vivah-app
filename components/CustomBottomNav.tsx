import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Animated Icon Component
const AnimatedIcon = ({
  name,
  isFocused,
  label,
}: {
  name: any;
  isFocused: boolean;
  label: string;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(withTiming(1.2), withTiming(1));
    } else {
      scale.value = withTiming(1);
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={name}
          size={24}
          color={isFocused ? Colors.light.gold : "#800000"} // Gold on Maroon (Active), Maroon on Ivory (Inactive)
        />
      </Animated.View>
    </View>
  );
};

export const CustomBottomNav = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Filter out hidden routes
        if (["services", "offers", "events"].includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;
        const label = options.title !== undefined ? options.title : route.name;

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
            <View style={[styles.iconContainer, isFocused && styles.activeTab]}>
              <AnimatedIcon
                name={(options as any).tabBarIconName}
                isFocused={isFocused}
                label={label as string}
              />
              {isFocused && <View style={styles.activeLabelDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.light.ivory, // Ivory Background
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 0, 0, 0.1)", // Subtle Maroon border
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 60,
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: Colors.light.maroon, // Maroon Pill for Active
  },
  activeLabelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.gold, // Gold Dot
    marginTop: 4,
  },
});
