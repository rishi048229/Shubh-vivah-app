import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { MotiView } from "moti";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InteractionsSheetProps {
  onDismiss?: () => void;
  onProfilePress?: (id: string) => void;
  initialTab?: "likes" | "views";
}

export interface InteractionsSheetRef extends BottomSheetModal {
  setTab: (tab: "likes" | "views") => void;
}

const InteractionsSheet = forwardRef<
  InteractionsSheetRef,
  InteractionsSheetProps
>(({ onDismiss, onProfilePress, initialTab = "likes" }, ref) => {
  const snapPoints = useMemo(() => ["60%", "85%"], []);
  const [activeTab, setActiveTab] = useState<"likes" | "views">(initialTab);

  // Expose method to change tab externally
  useImperativeHandle(
    ref,
    () =>
      ({
        // We need to forward standard BottomSheetModal methods manually if we extend the type
        // However, for simplicity in this ref pattern, we utilize the fact that the ref acts as the modal
        // But since we are wrapping it, we might need a separate ref or just use state if controlled from parent.
        // A cleaner way in Gorhom is to just pass props, but let's stick to the ref pattern requested.
        // Actually, 'ref' here is forwarded to BottomSheetModal.
        // We can't easily add methods to the external ref without breaking the type unless we cast.
        // Instead, let's just rely on the parent creating the ref and calling methods on it,
        // OR we use a state management approach.
        // For now, let's keep it simple: The parent opens it.
        // To allow changing tabs, we can add a custom method if we cast the ref.
        present: () => {
          // @ts-ignore
          innerRef.current?.present();
        },
        dismiss: () => {
          // @ts-ignore
          innerRef.current?.dismiss();
        },
        setTab: (tab: "likes" | "views") => setActiveTab(tab),
      }) as any,
    [],
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
    >
      <View style={styles.container}>
        {/* Header & Tabs */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity Center</Text>

          <View style={styles.tabContainer}>
            {/* Sliding Background */}
            <MotiView
              animate={{
                translateX: activeTab === "likes" ? 0 : 155, // Approximate slide distance
              }}
              transition={{ type: "spring", damping: 15 }}
              style={styles.slidingIndicator}
            />

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("likes")}
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
              onPress={() => setActiveTab("views")}
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
            <MotiView
              key={profile.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100, type: "timing" }}
            >
              <TouchableOpacity
                style={styles.item}
                onPress={() => onProfilePress?.(profile.id)}
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

                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>View</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </MotiView>
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
    padding: 4,
    position: "relative",
    height: 44,
  },
  slidingIndicator: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 1,
  },
  // removed activeTab style as Moti handles background
  activeTab: {},
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
