import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: "person-outline", label: "My Profile" },
  { icon: "heart-circle-outline", label: "My Matches" },
  { icon: "star-outline", label: "Shortlisted" },
  { icon: "chatbubbles-outline", label: "Chats" },
  { icon: "settings-outline", label: "Settings" },
  { icon: "help-circle-outline", label: "Help & Support" },
  { icon: "lock-closed-outline", label: "Privacy Policy" },
];

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter(); // Initialize router
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-width);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, { duration: 300 });
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

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-width, 0],
      [0, 0.5],
      "clamp",
    );
    return {
      opacity,
      display: opacity === 0 ? "none" : "flex",
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
            {/* Close / Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={Colors.light.maroon} />
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <TouchableOpacity
              style={styles.profileSection}
              onPress={() => {
                onClose();
                router.push("/(tabs)/profile"); // Navigate to profile tab
              }}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={require("@/assets/images/irina_dhruv.jpg")}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.name}>Rishi</Text>
              <Text style={styles.membership}>Premium Member</Text>
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuList}>
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    if (item.label === "My Profile")
                      router.push("/(tabs)/profile");
                    else if (item.label === "My Matches")
                      router.push("/(tabs)/connections");
                    else if (item.label === "Chats")
                      router.push("/(tabs)/chat");
                    // Add other routes as needed
                  }}
                >
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={Colors.light.gold}
                    />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#ccc"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                onClose();
                router.replace("/login"); // Logout logic
              }}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(255,0,0,0.1)" },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={Colors.light.maroon}
                />
              </View>
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
    zIndex: 1000,
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
    backgroundColor: Colors.light.ivory, // Ivory BG
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  headerRow: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.gold,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.maroon,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  membership: {
    fontSize: 14,
    color: Colors.light.gold,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.light.maroon,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.maroon,
    fontWeight: "bold",
    marginLeft: 15,
  },
});
