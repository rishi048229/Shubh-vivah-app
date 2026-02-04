import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GenderSelection() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      // In a real app, you might save this to context/storage here
      router.push({
        pathname: "/complete-profile/basic-details",
        params: { gender: selectedGender }, // Pass gender as param if needed
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Gender</Text>

        <View style={styles.optionsContainer}>
          {/* Male Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === "Male" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedGender("Male")}
            activeOpacity={0.9}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
                  style={styles.avatar}
                />
              </View>
            </View>
            <Text
              style={[
                styles.optionLabel,
                selectedGender === "Male" && styles.optionLabelSelected,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          {/* Female Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === "Female" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedGender("Female")}
            activeOpacity={0.9}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: "https://avatar.iran.liara.run/public/girl" }}
                  style={styles.avatar}
                />
              </View>
            </View>
            <Text
              style={[
                styles.optionLabel,
                selectedGender === "Female" && styles.optionLabelSelected,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <Image
          source={require("../../assets/images/design_divider.png")}
          style={styles.divider}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.button, !selectedGender && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    marginTop: -50, // Pull up slightly
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  optionCard: {
    width: "47%",
    aspectRatio: 0.85,
    backgroundColor: "#FFFCF5",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: Colors.light.maroon,
    backgroundColor: "#FFF5F5",
    borderWidth: 2.5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#D4AF37", // Gold
    padding: 2, // Spacing for inner image
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  optionLabelSelected: {
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
  divider: {
    width: 250,
    height: 300,
    marginBottom: 40,
    opacity: 0.8,
  },
  button: {
    width: "100%",
    backgroundColor: Colors.light.maroon,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: Colors.light.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
