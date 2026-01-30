import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface FullScreenMapProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_PINS = [
  { id: 1, x: 100, y: 200, image: "https://i.pravatar.cc/150?img=9" },
  { id: 2, x: 250, y: 150, image: "https://i.pravatar.cc/150?img=5" },
  { id: 3, x: 50, y: 400, image: "https://i.pravatar.cc/150?img=1" },
  { id: 4, x: 300, y: 500, image: "https://i.pravatar.cc/150?img=3" },
  { id: 5, x: 180, y: 600, image: "https://i.pravatar.cc/150?img=8" },
  { id: 6, x: 320, y: 300, image: "https://i.pravatar.cc/150?img=12" },
];

export const FullScreenMap = ({ visible, onClose }: FullScreenMapProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Map View (Mock ScrollView) */}
        <ScrollView
          horizontal
          contentContainerStyle={{ width: width * 2, height: height * 2 }}
          bounces={false}
        >
          <ScrollView
            contentContainerStyle={{ width: width * 2, height: height * 2 }}
            bounces={false}
          >
            <View style={styles.mapBackground}>
              {/* Grid Lines to simulate map */}
              <View style={styles.gridLineHorizontal} />
              <View style={[styles.gridLineHorizontal, { top: 400 }]} />
              <View style={[styles.gridLineHorizontal, { top: 800 }]} />
              <View style={styles.gridLineVertical} />
              <View style={[styles.gridLineVertical, { left: 400 }]} />

              <Text style={styles.watermark}>Interactive Map Area</Text>

              {/* Pins */}
              {MOCK_PINS.map((pin) => (
                <View
                  key={pin.id}
                  style={[styles.pin, { left: pin.x, top: pin.y }]}
                >
                  <Image source={{ uri: pin.image }} style={styles.pinImage} />
                  <View style={styles.pinTip} />
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Overlay UI */}
        <View style={[styles.overlay, { paddingTop: insets.top + 10 }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onClose}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.light.maroon}
              />
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                placeholder="Search area or city..."
                style={styles.searchInput}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="locate" size={24} color={Colors.light.ivory} />
            <Text style={styles.fabText}>Search this area</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E6F4FE",
    position: "relative",
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 200,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 200,
    width: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  watermark: {
    position: "absolute",
    top: 100,
    left: 100,
    fontSize: 40,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.03)",
    transform: [{ rotate: "-45deg" }],
  },
  pin: {
    position: "absolute",
    alignItems: "center",
  },
  pinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    zIndex: 2,
  },
  pinTip: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.light.gold,
    marginTop: -2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "box-none",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 46,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  fabText: {
    color: Colors.light.ivory,
    fontWeight: "bold",
    fontSize: 14,
  },
});
