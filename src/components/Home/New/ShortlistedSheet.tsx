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
            {shortlisted.map((profile, index) => (
              <MotiView
                key={profile.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
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
                    <Text style={styles.details} numberOfLines={1}>
                      {profile.location}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.bookmarkBtn}>
                    <Ionicons name="bookmark" size={20} color={Colors.maroon} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </MotiView>
            ))}

            {shortlisted.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={48} color="#D6D3D1" />
                <Text style={styles.emptyText}>
                  No profiles shortlisted yet.
                </Text>
              </View>
            )}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  details: {
    fontSize: 13,
    color: "#A8A29E",
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 8,
    backgroundColor: "#FFF1F2",
    borderRadius: 20,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },
  emptyText: {
    color: "#A8A29E",
    fontSize: 14,
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
