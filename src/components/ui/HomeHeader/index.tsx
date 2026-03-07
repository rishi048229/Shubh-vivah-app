import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getProfile } from "@/services/profileService";
import { getAvatarUrl } from "@/utils/avatar";

type HomeHeaderProps = {
  onOpenSidebar: () => void;
};

export default function HomeHeader({ onOpenSidebar }: HomeHeaderProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{
    fullName?: string;
    profilePhotoUrl?: string;
    gender?: string;
    city?: string;
  }>({});

  useEffect(() => {
    let mounted = true;
    getProfile().then((p) => {
      if (mounted && p) {
        setUserProfile(p);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const avatarUri = getAvatarUrl(
    userProfile.profilePhotoUrl,
    userProfile.gender,
    userProfile.fullName || "User"
  );
  const firstName = userProfile.fullName?.split(" ")[0] || "User";

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {/* Left: Avatar & Greeting */}
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={onOpenSidebar} activeOpacity={0.8}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{firstName}, find matches</Text>
            {userProfile.city && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.locationText}>{userProfile.city}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/routes/search" as any)}
          >
            <Ionicons name="search-outline" size={24} color={Colors.maroon} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push("/routes/notifications" as any)}
          >
            <View style={styles.notificationIconWrapper}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={Colors.maroon}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Colors.ivory,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#051960",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#C21807",
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
});
