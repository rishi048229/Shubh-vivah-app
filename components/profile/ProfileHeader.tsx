import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActionSheetIOS,
    Alert,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    SlideInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileImagePicker } from "./ProfileImagePicker";

interface ProfileHeaderProps {
  name: string;
  age?: number;
  city?: string;
  profession?: string;
  isVerified?: boolean;
  showBackButton?: boolean;
}

export const ProfileHeader = ({
  name,
  age,
  city,
  profession,
  isVerified = false,
  showBackButton = false,
}: ProfileHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profileImage, setProfileImage, completionPercentage } = useProfile();
  const [showMenu, setShowMenu] = useState(false);

  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15 });
    opacity.value = withSpring(1);
  }, []);

  const nameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const locationString = [city, profession].filter(Boolean).join(" • ");

  const handleChangePhoto = async () => {
    setShowMenu(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await setProfileImage(result.assets[0].uri);
    }
  };

  const handleMenuPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Change Profile Photo", "View Photo"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleChangePhoto();
          else if (buttonIndex === 2 && profileImage) {
            // View photo - could open a modal
            Alert.alert("Profile Photo", "View feature coming soon!");
          }
        },
      );
    } else {
      setShowMenu(true);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <LinearGradient
        colors={[Colors.light.warmGradientStart, Colors.light.warmGradientEnd]}
        style={styles.background}
      />

      {/* Header Actions */}
      <View style={styles.headerRow}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={Colors.light.maroon}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={Colors.light.maroon}
          />
        </TouchableOpacity>
      </View>

      {/* Android Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuContainer, { top: insets.top + 50 }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleChangePhoto}
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color={Colors.light.maroon}
              />
              <Text style={styles.menuText}>Change Profile Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                Alert.alert("View Photo", "Coming soon!");
              }}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={Colors.light.maroon}
              />
              <Text style={styles.menuText}>View Photo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Image */}
      <Animated.View
        entering={FadeIn.duration(600).delay(200)}
        style={styles.profileContainer}
      >
        <ProfileImagePicker
          imageUri={profileImage || undefined}
          size={130}
          showProgress={true}
          completionPercentage={completionPercentage}
        />
      </Animated.View>

      {/* User Info */}
      <Animated.View
        entering={SlideInUp.duration(500).delay(400)}
        style={styles.infoContainer}
      >
        <View style={styles.nameRow}>
          <Animated.Text style={[styles.name, nameAnimatedStyle]}>
            {name}
          </Animated.Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.light.verified}
              />
            </View>
          )}
        </View>

        {age && <Text style={styles.age}>{age} years</Text>}

        {locationString && (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={Colors.light.maroon}
            />
            <Text style={styles.location}>{locationString}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.maroon,
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  age: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.light.maroon,
    opacity: 0.8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    right: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    color: Colors.light.maroon,
    fontWeight: "500",
  },
});
