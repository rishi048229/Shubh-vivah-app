import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { getCurrentUserId, subscribeToNotifications } from "@/services/chatService";
import { getAvatarUrl } from "@/utils/avatar";
import { viewFullProfile } from "@/services/matchService";
import { Colors } from "@/constants/Colors";

interface ToastData {
  id: string;
  title: string;
  message: string;
  avatar: string;
  senderId: number;
}

export function GlobalNotificationToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const uid = await getCurrentUserId();
      if (!uid) return;

      subscribeToNotifications(uid, "global_toast", async (event) => {
        if (!mounted) return;

        if (event.type === "NEW_MESSAGE") {
          let reqName = "Someone";
          let reqImage: string | undefined;
          let reqGender: string | undefined;

          try {
            const fromProfile = await viewFullProfile(event.senderId);
            if (fromProfile) {
              reqName = fromProfile.fullName || "Someone";
              reqImage = fromProfile.profilePhotoUrl;
              reqGender = fromProfile.gender;
            }
          } catch (e) {}

          const avatar = getAvatarUrl(reqImage, reqGender, reqName);

          setToast({
            id: Date.now().toString(),
            title: reqName,
            message: event.content || "Sent you a message",
            avatar,
            senderId: event.senderId,
          });

          // Auto-hide after 4 seconds
          setTimeout(() => {
            if (mounted) setToast(null);
          }, 4000);
        }
      });
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  if (!toast) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      exiting={FadeOutUp.duration(300)}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.toastCard}
        onPress={() => {
          router.push(`/chat/${toast.senderId}`);
          setToast(null);
        }}
      >
        <Image source={{ uri: toast.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {toast.title}
          </Text>
          <Text style={styles.message} numberOfLines={1}>
            {toast.message}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(128,0,0,0.1)",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D1406",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: "#666",
  },
});
