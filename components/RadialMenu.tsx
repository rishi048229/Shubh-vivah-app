import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: "person-outline", label: "Profile" },
  { icon: "people-outline", label: "People" },
  { icon: "heart-outline", label: "Matches" },
  { icon: "chatbubbles-outline", label: "Messages" },
  { icon: "card-outline", label: "Plans" },
  { icon: "rose-outline", label: "Services" },
  { icon: "gift-outline", label: "Offers" },
  { icon: "settings-outline", label: "Settings" },
];

export const RadialMenu: React.FC<RadialMenuProps> = ({ isOpen, onClose }) => {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      const delta = (e.translationX + e.translationY) / 2;
      rotation.value = savedRotation.value + delta * 0.01;
    })
    .onEnd((e) => {
      const velocity = (e.velocityX + e.velocityY) / 2;
      rotation.value = withDecay({
        velocity: velocity * 0.001,
        deceleration: 0.998,
      });
    });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
    };
  });

  return (
    <View
      style={[styles.container, { zIndex: isOpen ? 200 : -1 }]}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        >
          <Animated.View style={[styles.backdropFill, backdropStyle]} />
        </TouchableOpacity>

        <GestureDetector gesture={panGesture}>
          <View style={styles.menuContainer}>
            {/* Central Logo Removed */}

            {MENU_ITEMS.map((item, index) => (
              <RadialMenuItem
                key={index}
                item={item}
                index={index}
                progress={progress}
                rotation={rotation}
                totalItems={MENU_ITEMS.length}
              />
            ))}
          </View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
};

interface RadialMenuItemProps {
  item: { icon: string; label: string };
  index: number;
  progress: SharedValue<number>;
  rotation: SharedValue<number>;
  totalItems: number;
}

const RadialMenuItem: React.FC<RadialMenuItemProps> = ({
  item,
  index,
  progress,
  rotation,
  totalItems,
}) => {
  const itemStyle = useAnimatedStyle(() => {
    const angle = ((Math.PI * 2) / totalItems) * index + rotation.value;
    const radius = 120;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const scale = interpolate(progress.value, [0, 1], [0, 1]);
    const translateX = interpolate(progress.value, [0, 1], [-50, x]);
    const translateY = interpolate(progress.value, [0, 1], [-50, y]);

    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity: progress.value,
    };
  });

  return (
    <Animated.View style={[styles.menuItemContainer, itemStyle]}>
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={Colors.light.maroon}
        />
        <Text style={styles.menuLabel}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  menuContainer: {
    position: "absolute",
    top: height / 2 - 150,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    // Transparent background, no border
  },
  menuItemContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  menuItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  menuLabel: {
    fontSize: 10,
    color: Colors.light.maroon,
    marginTop: 2,
    fontWeight: "600",
  },
});
