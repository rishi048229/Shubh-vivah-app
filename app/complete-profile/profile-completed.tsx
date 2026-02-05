import { COLORS } from "@/constants/profileConstants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

import { useProfile } from "@/context/ProfileContext";
import { profileService } from "@/services/profileService";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

const ProfileCompleted = () => {
  const router = useRouter();
  const { profileData } = useProfile();
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    setLoading(true);
    try {
      await profileService.saveOrUpdateProfile(profileData);
      Alert.alert("Success", "Profile submitted successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)") },
      ]);
    } catch (error: any) {
      console.error("Profile Submit Error", error);
      const msg = error.response?.data?.message || "Failed to save profile";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Logo */}
        <Image
          source={require("../../assets/images/logo.jpg")} // Adjusted path to standard assets
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.contentContainer}>
          {/* Success Check Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" color="#FFFFFF" size={35} />
          </View>

          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.heading}>Profile Completed</Text>
            <Text style={styles.subtext}>
              For further process complete your KYC
            </Text>
          </View>

          {/* Main Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleProceed}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Proceed to KYC</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    paddingTop: 70,
  },
  logo: {
    width: width * 0.8,
    height: 100,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 8,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  textSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: width * 0.75,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default ProfileCompleted;
