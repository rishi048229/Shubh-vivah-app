import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Map route names to icons
const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  connections: "people",
  match: "heart",
  chat: "chatbubbles",
  service: "grid",
};

const LABELS: Record<string, string> = {
  index: "Home",
  connections: "Connections",
  match: "Matches",
  chat: "Chat",
  service: "Services",
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
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

          return (
            <TabBarItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              icon={ICONS[route.name] || "help"}
              label={LABELS[route.name] || route.name}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabBarItemProps {
  isFocused: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

function TabBarItem({ isFocused, onPress, icon, label }: TabBarItemProps) {
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(animatedValue.value, [0, 1], [1, 1.1]),
        },
        {
          translateY: interpolate(animatedValue.value, [0, 1], [0, -4]), // Move up slightly
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        {/* Render Icon - Red when active, Gray when inactive */}
        <Ionicons
          name={isFocused ? icon : ((icon + "-outline") as any)}
          size={24}
          color={isFocused ? "#C21807" : "#888"}
        />
      </Animated.View>

      <Text style={[styles.label, { color: isFocused ? "#C21807" : "#888" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, // Docked to bottom
    left: 0,
    right: 0,
    elevation: 10,
    backgroundColor: "transparent", // Container transparent
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFF0", // Ivory Background
    height: 70, // Taller for better touch area
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0E6D2",
    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
