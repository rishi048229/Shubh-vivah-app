import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { MotiView } from "moti";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ShortlistedSheetProps {
  onDismiss?: () => void;
  onProfilePress?: (id: string) => void;
}

const ShortlistedSheet = forwardRef<BottomSheetModal, ShortlistedSheetProps>(
  ({ onDismiss, onProfilePress }, ref) => {
    const snapPoints = useMemo(() => ["60%", "85%"], []);

    // Simulating Shortlisted Profiles (using same mock data for now)
    const shortlisted = MOCK_MATCHES.slice(1, 4);

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
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onDismiss={onDismiss}
        backgroundStyle={{ backgroundColor: "#FFF", borderRadius: 24 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Shortlisted Profiles</Text>
            <Text style={styles.subtitle}>
              {shortlisted.length} saved profiles
            </Text>
          </View>

          <BottomSheetScrollView contentContainerStyle={styles.listContent}>
            <View style={styles.comingSoonContainer}>
              <View style={styles.comingSoonIconBg}>
                <Ionicons name="bookmark" size={36} color={Colors.maroon} />
              </View>
              <Text style={styles.comingSoonTitle}>Shortlist Coming Soon! 💝</Text>
              <Text style={styles.comingSoonSubtitle}>
                Save your favorite profiles and revisit them anytime. We're crafting the perfect experience for you to manage your top picks effortlessly.
              </Text>
              <View style={styles.featureBox}>
                <View style={styles.featureRow}>
                  <Ionicons name="heart-outline" size={16} color={Colors.maroon} />
                  <Text style={styles.featureText}>Save profiles you love</Text>
                </View>
                <View style={styles.featureRow}>
                  <Ionicons name="list-outline" size={16} color={Colors.maroon} />
                  <Text style={styles.featureText}>Organize and compare matches</Text>
                </View>
                <View style={styles.featureRow}>
                  <Ionicons name="notifications-outline" size={16} color={Colors.maroon} />
                  <Text style={styles.featureText}>Get notified on profile updates</Text>
                </View>
              </View>
              <Text style={styles.comingSoonFooter}>We're working hard on this — stay tuned! ✨</Text>
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
  },
  subtitle: {
    fontSize: 14,
    color: "#78716C",
    marginTop: 4,
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
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFF1F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(128, 0, 0, 0.15)",
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
  featureBox: {
    width: "100%",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(128, 0, 0, 0.08)",
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
    color: Colors.maroon,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 16,
    marginLeft: 10,
  },
  deleteText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default ShortlistedSheet;
