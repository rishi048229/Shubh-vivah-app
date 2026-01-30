import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.85; // Covers most of the screen

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: "person-outline", label: "My Profile" },
  { icon: "star-outline", label: "My Reviews" },
  { icon: "shield-checkmark-outline", label: "Safety" },
  { icon: "help-circle-outline", label: "Help & Support" },
  { icon: "lock-closed-outline", label: "Privacy Policy" },
  { icon: "settings-outline", label: "Setting" },
  { icon: "document-text-outline", label: "Terms & Condition" },
  { icon: "log-out-outline", label: "Leave Application" }, // Icon for leave?
  { icon: "gavel", label: "Legal" }, // Icon for legal
];

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-width); // Start off-screen to the left

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: 300,
      });
    } else {
      translateX.value = withTiming(-width, { duration: 300 });
    }
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -100 || e.velocityX < -500) {
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-width, 0],
      [0, 0.5],
      "clamp",
    );
    return {
      opacity,
      display: opacity === 0 ? "none" : "flex", // Hide when fully closed
    };
  });

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.container]} pointerEvents="auto">
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        {/* Drawer Content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.drawer, drawerStyle, { paddingTop: insets.top }]}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.light.maroon} />
            </TouchableOpacity>

            {/* Profile Header */}
            <View style={styles.header}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }} // Placeholder
                style={styles.avatar}
              />
              <View style={styles.headerText}>
                <Text style={styles.name}>Vatsal Kantariya</Text>
                <Text style={styles.phone}>9601430331</Text>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuList}>
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={Colors.light.maroon}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <TouchableOpacity style={styles.logoutButton}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={Colors.light.maroon}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.light.gold, // Yellow background
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.light.maroon,
  },
  headerText: {
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  phone: {
    fontSize: 14,
    color: Colors.light.maroon,
    opacity: 0.8,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.light.maroon,
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.maroon,
    marginLeft: 15,
    fontWeight: "600",
  },
});
