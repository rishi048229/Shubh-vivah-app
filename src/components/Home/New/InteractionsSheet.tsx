import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

interface InteractionsSheetProps {
  onDismiss?: () => void;
  onProfilePress?: (id: string) => void;
  initialTab?: "likes" | "views";
}

export interface InteractionsSheetRef extends BottomSheetModal {
  setTab: (tab: "likes" | "views") => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_CONTAINER_PADDING = 4;
const TAB_WIDTH = (SCREEN_WIDTH - 40 - TAB_CONTAINER_PADDING * 2) / 2;

const InteractionsSheet = forwardRef<
  InteractionsSheetRef,
  InteractionsSheetProps
>(({ onDismiss, onProfilePress, initialTab = "likes" }, ref) => {
  const snapPoints = useMemo(() => ["60%", "90%"], []);
  const [activeTab, setActiveTab] = useState<"likes" | "views">(initialTab);

  // Smooth sliding indicator animation
  const tabOffset = useSharedValue(initialTab === "likes" ? 0 : TAB_WIDTH);

  const switchTab = useCallback(
    (tab: "likes" | "views") => {
      setActiveTab(tab);
      tabOffset.value = withTiming(tab === "likes" ? 0 : TAB_WIDTH, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    },
    [tabOffset],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabOffset.value }],
  }));

  useImperativeHandle(
    ref,
    () =>
      ({
        present: () => {
          // @ts-ignore
          innerRef.current?.present();
        },
        dismiss: () => {
          // @ts-ignore
          innerRef.current?.dismiss();
        },
        setTab: (tab: "likes" | "views") => switchTab(tab),
      }) as any,
    [switchTab],
  );

  const innerRef = React.useRef<BottomSheetModal>(null);

  // Mock Data
  const likes = MOCK_MATCHES.slice(0, 4);
  const views = MOCK_MATCHES.slice(2, 6);

  const data = activeTab === "likes" ? likes : views;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.65}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={innerRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onDismiss}
      backgroundStyle={{ backgroundColor: "#FFFdf9", borderRadius: 32 }}
      handleIndicatorStyle={{ backgroundColor: "#D4AF37", width: 60, height: 6, borderRadius: 3 }}
    >
      <View style={styles.container}>
        {/* Header & Tabs */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity Center</Text>
          <Text style={styles.subtitle}>See who is interacting with your profile</Text>

          <View style={styles.tabContainer}>
            {/* Smooth Sliding Background */}
            <Animated.View style={[styles.slidingIndicator, indicatorStyle]}>
              <LinearGradient
                colors={["#800000", "#A52A2A"]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab("likes")}
            >
              <Text style={[styles.tabText, activeTab === "likes" && styles.activeTabText]}>
                Likes Received
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab("views")}
            >
              <Text style={[styles.tabText, activeTab === "views" && styles.activeTabText]}>
                Profile Views
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List */}
        <BottomSheetScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {data.map((profile, index) => (
            <Animated.View
              key={`${activeTab}-${profile.id}`}
              entering={FadeInDown.delay(index * 100)
                .duration(400)
                .easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
            >
              <TouchableOpacity
                style={styles.itemWrapper}
                onPress={() => onProfilePress?.(profile.id)}
                activeOpacity={0.8}
              >
                <BlurView intensity={80} tint="light" style={styles.item}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: profile.imageUri }}
                      style={styles.avatar}
                    />
                    <View style={styles.onlineBadge}>
                      <Ionicons name="sparkles" size={10} color="#FFF" />
                    </View>
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {profile.name}, {profile.age}
                    </Text>
                    <Text style={styles.time}>
                      {activeTab === "likes"
                        ? "Liked your profile"
                        : "Viewed your profile"}{" "}
                      • {index + 1}h ago
                    </Text>
                  </View>

                  <LinearGradient
                    colors={["#D4AF37", "#F3E5AB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionBtnGradient}
                  >
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => onProfilePress?.(profile.id)}
                    >
                      <Text style={styles.actionBtnText}>View</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {data.length === 0 && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
              <Ionicons name="eye-off-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No recent {activeTab} yet.</Text>
            </Animated.View>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#800000",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#78716C",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FCECD4",
    borderRadius: 16,
    padding: TAB_CONTAINER_PADDING,
    position: "relative",
    height: 50,
    width: "100%",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  slidingIndicator: {
    position: "absolute",
    left: TAB_CONTAINER_PADDING,
    top: TAB_CONTAINER_PADDING,
    bottom: TAB_CONTAINER_PADDING,
    width: TAB_WIDTH,
    borderRadius: 12,
    shadowColor: "#800000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9C7C38",
    opacity: 0.8,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
    opacity: 1,
  },
  listContent: {
    gap: 16,
    paddingBottom: 40,
  },
  itemWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: "#D4AF37",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D1406",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#856A5D",
    fontWeight: "500",
  },
  actionBtnGradient: {
    borderRadius: 20,
    padding: 2,
    overflow: "hidden",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#800000",
  },
  emptyState: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
});

export default InteractionsSheet;
