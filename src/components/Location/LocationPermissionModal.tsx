import { Colors } from "@/constants/Colors";
import * as locationService from "@/services/locationService";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

interface LocationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationDetected: (city: string) => void;
}

export default function LocationPermissionModal({
  visible,
  onClose,
  onLocationDetected,
}: LocationPermissionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    setLoading(true);
    try {
      console.log("Requesting location...");
      const location = await locationService.getCurrentLocation();
      console.log("Location result:", location);

      if (location && location.city) {
        onLocationDetected(location.city);
        onClose();
      } else if (location) {
        // Fallback if city not found but coords found
        Alert.alert(
          "Location Found",
          "Coordinates found, but city name could not be determined. Saving anyway.",
        );
        onLocationDetected("Current Location");
        onClose();
      } else {
        // Permission denied, services disabled, or error
        Alert.alert(
          "Location Error",
          "Could not fetch location.\n\n1. Ensure GPS is ENABLED in quick settings.\n2. Ensure App Permissions are 'Allowed'.\n\nPlease try entering city manually.",
        );
      }
    } catch (error) {
      console.log("Location error", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while fetching location.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    onClose();
    // Navigate to profile edit or show another modal
    router.push("/profile/edit" as any);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.container}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

        <Animated.View
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.springify()}
          style={styles.modalContent}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={40} color={Colors.maroon} />
          </View>

          <Text style={styles.title}>Enable Location</Text>
          <Text style={styles.description}>
            To show you the best matches nearby, we need access to your
            location. We only use this to find matches in your city.
          </Text>

          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.allowButtonText}>Allow Location Access</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualEntry}
            disabled={loading}
          >
            <Text style={styles.manualButtonText}>Enter City Manually</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  allowButton: {
    width: "100%",
    backgroundColor: Colors.maroon,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  allowButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  manualButton: {
    paddingVertical: 10,
  },
  manualButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
});
