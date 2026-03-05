import { Colors } from "@/constants/Colors";
import * as locationService from "@/services/locationService";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import api from "@/services/api";

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
  const [loading, setLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCity, setManualCity] = useState("");

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
        Alert.alert(
          "Location Found",
          "Coordinates found, but city name could not be determined. Saving anyway.",
        );
        onLocationDetected("Current Location");
        onClose();
      } else {
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
    setShowManualInput(true);
  };

  const handleSaveManualCity = async () => {
    const city = manualCity.trim();
    if (!city) {
      Alert.alert("Enter City", "Please type your city name.");
      return;
    }

    setLoading(true);
    try {
      // Save to backend with the city name (coords 0,0 as placeholder)
      await api.put(`/profile/location?lat=0&lng=0&city=${encodeURIComponent(city)}`);
      console.log("Manual city saved to backend:", city);
      onLocationDetected(city);
      setShowManualInput(false);
      setManualCity("");
      onClose();
    } catch (error) {
      console.log("Failed to save manual city", error);
      // Still update locally even if backend fails
      onLocationDetected(city);
      setShowManualInput(false);
      setManualCity("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowManualInput(false);
    setManualCity("");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

          <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutDown.springify()}
            style={styles.modalContent}
          >
            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={22} color="#999" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Ionicons name="location" size={40} color={Colors.maroon} />
            </View>

            <Text style={styles.title}>
              {showManualInput ? "Enter Your City" : "Enable Location"}
            </Text>

            {!showManualInput ? (
              <>
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
                    <Text style={styles.allowButtonText}>
                      Allow Location Access
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.manualButton}
                  onPress={handleManualEntry}
                  disabled={loading}
                >
                  <Text style={styles.manualButtonText}>
                    Enter City Manually
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.description}>
                  Type your city name below. This will be saved to your profile.
                </Text>

                <TextInput
                  style={styles.cityInput}
                  placeholder="e.g. Mumbai, Pune, Delhi..."
                  placeholderTextColor="#aaa"
                  value={manualCity}
                  onChangeText={setManualCity}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveManualCity}
                />

                <TouchableOpacity
                  style={styles.allowButton}
                  onPress={handleSaveManualCity}
                  disabled={loading || !manualCity.trim()}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.allowButtonText}>Save Location</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.manualButton}
                  onPress={() => setShowManualInput(false)}
                >
                  <Text style={styles.manualButtonText}>
                    ← Use GPS Instead
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
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
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
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
    marginBottom: 24,
  },
  cityInput: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#E0D5C5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FAFAF8",
    marginBottom: 20,
    textAlign: "center",
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
