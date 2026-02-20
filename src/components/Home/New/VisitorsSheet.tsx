import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VisitorsSheetProps {
  onDismiss: () => void;
  onProfilePress?: (id: string) => void;
}

const VisitorsSheet = forwardRef<BottomSheetModal, VisitorsSheetProps>(
  ({ onDismiss, onProfilePress }, ref) => {
    // 50-60% height as requested (half screen)
    const snapPoints = useMemo(() => ["60%"], []);

    const visitors = MOCK_MATCHES.slice(0, 5); // Mock visitors

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
          <Text style={styles.title}>Recent Visitors</Text>
          <Text style={styles.subtitle}>
            People who viewed your profile recently
          </Text>

          <BottomSheetScrollView contentContainerStyle={styles.listContent}>
            {visitors.map((visitor) => (
              <TouchableOpacity
                key={visitor.id}
                style={styles.visitorItem}
                onPress={() => onProfilePress?.(visitor.id)}
              >
                <Image
                  source={{ uri: visitor.imageUri }}
                  style={styles.avatar}
                />

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {visitor.name}, {visitor.age}
                  </Text>
                  <Text style={styles.time}>Viewed 2h ago</Text>
                </View>

                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  listContent: {
    gap: 16,
    paddingBottom: 20,
  },
  visitorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE",
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
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: "#FFF0F0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  viewText: {
    color: Colors.maroon,
    fontWeight: "600",
    fontSize: 12,
  },
});

export default VisitorsSheet;
