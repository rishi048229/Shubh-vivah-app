import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useRouter, usePathname } from "expo-router";
import {
  connectWebSocket,
  getCurrentUserId,
  subscribeToNotifications,
} from "@/services/chatService";
import { getAvatarUrl } from "@/utils/avatar";
import { viewFullProfile } from "@/services/matchService";
import { Ionicons } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS, withSpring } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ToastData {
  id: string;
  title: string;
  message: string;
  avatar: string;
  senderId: number;
  timestamp: string;
}

export function GlobalNotificationToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const progressWidth = useSharedValue(100);
  const translateY = useSharedValue(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const dismissToast = () => {
    setToast(null);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        // swipe up to dismiss
        translateY.value = withTiming(-150, { duration: 200 }, () => {
          runOnJS(dismissToast)();
        });
      } else {
        // spring back
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    let mounted = true;
    let retryTimer: ReturnType<typeof setTimeout>;

    const init = async () => {
      try {
        const uid = await getCurrentUserId();
        if (!uid || !mounted) return;

        await connectWebSocket();

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
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Clear any existing timer
            if (hideTimer.current) clearTimeout(hideTimer.current);

            setToast({
              id: Date.now().toString(),
              title: reqName,
              message: event.content || "Sent you a message",
              avatar,
              senderId: event.senderId,
              timestamp: timeStr,
            });

            // Animate progress bar
            progressWidth.value = 100;
            progressWidth.value = withTiming(0, {
              duration: 5000,
              easing: Easing.linear,
            });

            // Auto-hide after 5 seconds
            hideTimer.current = setTimeout(() => {
              if (mounted) setToast(null);
            }, 5000);
          }
        });
      } catch (err) {
        console.warn("[GlobalToast] STOMP connect failed, retrying in 5s:", err);
        retryTimer = setTimeout(() => {
          if (mounted) init();
        }, 5000);
      }
    };

    init();
    return () => {
      mounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      translateY.value = 0;
    }
  }, [toast]);

  if (!toast) return null;

  // Hide toast if actively chatting with the sender of THIS specific toast message
  if (pathname === `/chat/${toast.senderId}`) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={FadeInUp.duration(400).springify().damping(15)}
        exiting={FadeOutUp.duration(300)}
        style={[styles.container, animatedStyle]}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.toastCard}
          onPress={() => {
            router.push(`/chat/${toast.senderId}` as any);
            dismissToast();
          }}
        >
        {/* Gradient accent strip on the left */}
        <View style={styles.accentStrip} />

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: toast.avatar }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        {/* Content */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {toast.title}
            </Text>
            <Text style={styles.timestamp}>{toast.timestamp}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>

        {/* Dismiss */}
        <TouchableOpacity
          style={styles.dismissBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={dismissToast}
        >
          <Ionicons name="close" size={16} color="#999" />
        </TouchableOpacity>

        {/* Progress bar at bottom */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "android" ? 36 : 56,
    left: 12,
    right: 12,
    zIndex: 99999,
    elevation: 99999,
  },
  toastCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",

    // Premium shadow
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,

    borderWidth: 0.5,
    borderColor: "rgba(194, 24, 7, 0.08)",
  },
  accentStrip: {
    width: 4,
    alignSelf: "stretch",
    backgroundColor: "#C21807",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 12,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFF1F2",
    backgroundColor: "#F5F5F5",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    flex: 1,
    marginRight: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 11,
    color: "#AAA",
    fontWeight: "500",
  },
  message: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  dismissBtn: {
    padding: 4,
    marginLeft: 4,
  },
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(194, 24, 7, 0.06)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#C21807",
    borderRadius: 2,
  },
});
