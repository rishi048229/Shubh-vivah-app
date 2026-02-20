import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import * as profileService from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInLeft,
    SlideOutLeft,
} from "react-native-reanimated";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.8; // 80% screen width

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isLogout?: boolean;
};

const MenuItem = ({ icon, label, onPress, isLogout }: MenuItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.pillItem, isLogout && styles.logoutItem]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={20}
            color={isLogout ? "#FFF" : Colors.maroon}
          />
        </View>
        <Text style={[styles.menuItemLabel, isLogout && styles.logoutText]}>
          {label}
        </Text>
      </View>
      {!isLogout && (
        <Ionicons name="chevron-forward" size={18} color={Colors.maroon} />
      )}
    </TouchableOpacity>
  );
};

export default function SideMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { logout, userId } = useAuth();
  const [userName, setUserName] = useState("User");
  const [userImage, setUserImage] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg",
  );

  const [userCity, setUserCity] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadUserProfile();
    }
  }, [visible]);

  const loadUserProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile) {
        setUserName(profile.fullName || "User");
        if (profile.profilePhotoUrl) {
          setUserImage(profile.profilePhotoUrl);
        }
        if (profile.city) {
          setUserCity(profile.city);
        }
      }
    } catch (error) {
      console.log("Error loading profile in SideMenu", error);
    }
  };

  const handleNavigation = (path: string) => {
    onClose();
    // Small timeout to allow drawer to close smooth
    setTimeout(() => {
      router.push(path as any);
    }, 200);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace("/(auth)/landing" as any);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose}>
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.backdropFill}
          />
        </TouchableOpacity>

        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.drawer}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Profile Header */}
              <View style={styles.profileSection}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: userImage }}
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.profileName}>{userName}</Text>
                {userCity && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                      gap: 4,
                    }}
                  >
                    <Ionicons name="location-sharp" size={14} color="#666" />
                    <Text
                      style={{ fontSize: 14, color: "#666", fontWeight: "500" }}
                    >
                      {userCity}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => handleNavigation("/profile")}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuList}>
                <MenuItem
                  icon="person-outline"
                  label="My Profile"
                  onPress={() => handleNavigation("/profile")}
                />
                <MenuItem
                  icon="heart-circle-outline"
                  label="My Matches"
                  onPress={() => handleNavigation("/(tabs)/match")}
                />
                <MenuItem
                  icon="star-outline"
                  label="Shortlisted"
                  onPress={() => handleNavigation("/shortlisted")}
                />
                <MenuItem
                  icon="chatbubbles-outline"
                  label="Chats"
                  onPress={() => handleNavigation("/(tabs)/chat")}
                />
                <MenuItem
                  icon="settings-outline"
                  label="Settings"
                  onPress={() => handleNavigation("/settings")}
                />
                <MenuItem
                  icon="help-circle-outline"
                  label="Help & Support"
                  onPress={() => handleNavigation("/help")}
                />
                <MenuItem
                  icon="shield-checkmark-outline"
                  label="Privacy Policy"
                  onPress={() => handleNavigation("/privacy")}
                />

                <View style={styles.spacer} />

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    width: MENU_WIDTH,
    height: "100%",
    backgroundColor: "#F8F8F8", // Off-white/Gray background for modern look
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: Colors.ivory,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: "#FFF",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginTop: 12,
  },
  viewProfileBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.maroon,
    borderRadius: 20,
  },
  viewProfileText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  menuList: {
    paddingHorizontal: 20,
  },
  pillItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutItem: {
    backgroundColor: Colors.maroon,
    marginTop: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF0F0", // Light red bg for icon
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutText: {
    color: "#FFF",
  },
  spacer: {
    height: 20,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
});
