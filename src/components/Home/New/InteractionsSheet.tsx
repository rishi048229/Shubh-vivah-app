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
const TAB_WIDTH = (SCREEN_WIDTH - 40 - TAB_CONTAINER_PADDING * 2) / 2; // 40 = container paddingHorizontal

const InteractionsSheet = forwardRef<
  InteractionsSheetRef,
  InteractionsSheetProps
>(({ onDismiss, onProfilePress, initialTab = "likes" }, ref) => {
  const snapPoints = useMemo(() => ["60%", "85%"], []);
  const [activeTab, setActiveTab] = useState<"likes" | "views">(initialTab);

  // Smooth sliding indicator animation
  const tabOffset = useSharedValue(initialTab === "likes" ? 0 : TAB_WIDTH);

  const switchTab = useCallback(
    (tab: "likes" | "views") => {
      setActiveTab(tab);
      tabOffset.value = withTiming(tab === "likes" ? 0 : TAB_WIDTH, {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    },
    [tabOffset],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabOffset.value }],
  }));

  // Expose method to change tab externally
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
        opacity={0.4}
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
      backgroundStyle={{ backgroundColor: "#FFF", borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
    >
      <View style={styles.container}>
        {/* Header & Tabs */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity Center</Text>

          <View style={styles.tabContainer}>
            {/* Smooth Sliding Background */}
            <Animated.View style={[styles.slidingIndicator, indicatorStyle]} />

            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab("likes")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "likes" && styles.activeTabText,
                ]}
              >
                Likes Received
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab("views")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "views" && styles.activeTabText,
                ]}
              >
                Profile Views
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List */}
        <BottomSheetScrollView contentContainerStyle={styles.listContent}>
          {data.map((profile, index) => (
            <Animated.View
              key={`${activeTab}-${profile.id}`}
              entering={FadeInDown.delay(index * 80)
                .duration(300)
                .springify()
                .damping(18)}
            >
              <TouchableOpacity
                style={styles.item}
                onPress={() => onProfilePress?.(profile.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: profile.imageUri }}
                  style={styles.avatar}
                />

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

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => onProfilePress?.(profile.id)}
                >
                  <Text style={styles.actionBtnText}>View</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {data.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent {activeTab}.</Text>
            </View>
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
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 16,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F4",
    borderRadius: 14,
    padding: TAB_CONTAINER_PADDING,
    position: "relative",
    height: 44,
  },
  slidingIndicator: {
    position: "absolute",
    left: TAB_CONTAINER_PADDING,
    top: TAB_CONTAINER_PADDING,
    bottom: TAB_CONTAINER_PADDING,
    width: TAB_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78716C",
  },
  activeTabText: {
    color: Colors.maroon,
    fontWeight: "700",
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E5E4",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D1406",
  },
  time: {
    fontSize: 12,
    color: "#A8A29E",
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#BE123C",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#A8A29E",
  },
});

export default InteractionsSheet;
