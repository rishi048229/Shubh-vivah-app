import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomBottomNav = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.pillContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Filter out hidden routes
          if (["services", "offers", "events"].includes(route.name)) {
            return null;
          }

          const label =
            options.title !== undefined ? options.title : route.name;
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
              style={[styles.tabButton, { flex: isFocused ? 2.5 : 1 }]}
            >
              <Animated.View
                layout={LinearTransition.duration(200)} // Smooth linear transition, no bounce
                style={[
                  styles.tabContent,
                  isFocused && styles.activeTabContent,
                ]}
              >
                <Ionicons
                  name={(options as any).tabBarIconName}
                  size={24}
                  color={isFocused ? Colors.light.maroon : Colors.light.ivory}
                />
                {isFocused && (
                  <Animated.Text
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={styles.label}
                    numberOfLines={1}
                  >
                    {label}
                  </Animated.Text>
                )}
              </Animated.View>
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
    backgroundColor: Colors.light.gold,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    maxWidth: 400,
    height: 80, // Fixed height for consistency
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
    overflow: "hidden",
  },
  activeTabContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
