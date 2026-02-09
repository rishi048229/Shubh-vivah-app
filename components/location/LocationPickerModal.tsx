import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function LocationPickerModal({
  visible,
  onClose,
  onSelectLocation,
}: LocationPickerModalProps) {
  const [loading, setLoading] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const [manualState, setManualState] = useState("");

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need location permission to find your city.",
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const { city, region, country } = address[0];
        onSelectLocation({
          city: city || "Unknown",
          state: region || "",
          country: country || "India",
          latitude,
          longitude,
        });
        onClose();
      } else {
        Alert.alert("Error", "Could not fetch address details.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get location.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualCity.trim()) {
      Alert.alert("Validation", "Please enter a city name.");
      return;
    }
    // Mock coordinates for manual entry (Real app would use Geocoding API)
    onSelectLocation({
      city: manualCity,
      state: manualState,
      country: "India", // Default
      latitude: 20.5937,
      longitude: 78.9629,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>📍 Set Your Location</Text>
          <Text style={styles.subtitle}>
            We use this to show you relevant matches nearby.
          </Text>

          {/* Option 1: Auto Detect */}
          <TouchableOpacity
            style={styles.autoButton}
            onPress={handleUseCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons
                  name="navigate"
                  size={20}
                  color="#FFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.autoButtonText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Option 2: Manual Entry */}
          <Text style={styles.label}>Enter Manually</Text>
          <TextInput
            style={styles.input}
            placeholder="City (e.g. Ahmedabad)"
            value={manualCity}
            onChangeText={setManualCity}
          />
          <TextInput
            style={styles.input}
            placeholder="State (Optional)"
            value={manualState}
            onChangeText={setManualState}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleManualSubmit}
          >
            <Text style={styles.saveButtonText}>Save Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  autoButton: {
    backgroundColor: Colors.light.maroon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
  },
  autoButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEE",
  },
  orText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },
  saveButton: {
    backgroundColor: Colors.light.gold,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.light.maroon,
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#999",
    fontSize: 14,
  },
});
