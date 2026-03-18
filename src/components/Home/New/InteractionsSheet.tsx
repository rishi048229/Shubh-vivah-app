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

        {/* Coming Soon Content */}
        <BottomSheetScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.comingSoonContainer}>
            <View style={styles.comingSoonIconBg}>
              <Ionicons name={activeTab === "likes" ? "heart" : "eye"} size={40} color="#D4AF37" />
            </View>
            <Text style={styles.comingSoonTitle}>
              {activeTab === "likes" ? "Likes" : "Profile Views"} Coming Soon! 🎉
            </Text>
            <Text style={styles.comingSoonSubtitle}>
              We're building something special for you! Soon you'll be able to see who {activeTab === "likes" ? "liked your profile" : "viewed your profile"} and connect with them instantly.
            </Text>
            <View style={styles.comingSoonFeatures}>
              <View style={styles.featureRow}>
                <Ionicons name="sparkles" size={16} color="#D4AF37" />
                <Text style={styles.featureText}>
                  {activeTab === "likes" ? "See who admires your profile" : "Track your profile visitors"}
                </Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="notifications-outline" size={16} color="#D4AF37" />
                <Text style={styles.featureText}>Get real-time notifications</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#D4AF37" />
                <Text style={styles.featureText}>Connect with one tap</Text>
              </View>
            </View>
            <Text style={styles.comingSoonFooter}>Stay tuned — exciting updates ahead! ✨</Text>
          </Animated.View>
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
    paddingBottom: 40,
  },
  comingSoonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  comingSoonIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF8E7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#800000",
    textAlign: "center",
    marginBottom: 10,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: "#78716C",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  comingSoonFeatures: {
    width: "100%",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#5D4037",
    fontWeight: "500",
  },
  comingSoonFooter: {
    fontSize: 13,
    color: "#D4AF37",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default InteractionsSheet;
