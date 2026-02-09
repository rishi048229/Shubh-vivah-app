import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Linking,
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
  { icon: "person-outline", label: "My Profile", route: "/(tabs)/profile" },
  {
    icon: "heart-circle-outline",
    label: "My Matches",
    route: "/(tabs)/connections",
  },
  { icon: "star-outline", label: "Shortlisted", route: "/shortlisted" },
  { icon: "chatbubbles-outline", label: "Chats", route: "/(tabs)/chat" },
  {
    icon: "settings-outline",
    label: "Settings",
    route: null,
    action: "settings",
  },
  {
    icon: "help-circle-outline",
    label: "Help & Support",
    route: null,
    action: "help",
  },
  {
    icon: "lock-closed-outline",
    label: "Privacy Policy",
    route: null,
    action: "privacy",
  },
];

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-width);
  const { profileData, profileImage, clearAllUserData } = useProfile();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

  const handleMenuPress = (item: (typeof MENU_ITEMS)[0]) => {
    onClose();

    if (item.route) {
      setTimeout(() => router.push(item.route as any), 300);
      return;
    }

    // Handle actions
    switch (item.action) {
      case "settings":
        setTimeout(() => router.push("/(tabs)/profile"), 300);
        break;
      case "help":
        Alert.alert("Help & Support", "How can we help you?", [
          {
            text: "Email Us",
            onPress: () => Linking.openURL("mailto:support@shubhvivah.com"),
          },
          {
            text: "Call Us",
            onPress: () => Linking.openURL("tel:+911234567890"),
          },
          {
            text: "FAQ",
            onPress: () =>
              Alert.alert(
                "FAQ",
                "Visit our website for frequently asked questions.",
              ),
          },
          { text: "Cancel", style: "cancel" },
        ]);
        break;
      case "privacy":
        Alert.alert(
          "Privacy Policy",
          "Your privacy matters to us. Read our full privacy policy at shubhvivah.com/privacy",
        );
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          onClose();
          await clearAllUserData();
          router.replace("/login");
        },
      },
    ]);
  };

  const userName = profileData.fullName || "Complete Profile";
  const defaultAvatar = "https://i.pravatar.cc/150?img=11";

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

            {/* Profile Info - Dynamic */}
            <TouchableOpacity
              style={styles.profileSection}
              onPress={() => {
                onClose();
                router.push("/(tabs)/profile");
              }}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profileImage || defaultAvatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.membership}>Premium Member</Text>
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuList}>
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item)}
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
              onPress={handleLogout}
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
    backgroundColor: Colors.light.ivory,
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
