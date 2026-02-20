import { COLORS } from "@/components/Profile/CompleteProfileForm";
import { useProfileForm } from "@/context/ProfileFormContext";
import * as profileService from "@/services/profileService";
import { useRouter } from "expo-router";
import { AlertCircle, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const ProfileCompleted = () => {
  const router = useRouter();
  const { formData, resetFormData } = useProfileForm();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    submitProfile();
  }, []);

  const submitProfile = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await profileService.saveProfile(formData);
      resetFormData();
      setIsSubmitting(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to save profile. Please try again.";
      setError(String(msg));
      setIsSubmitting(false);
    }
  };

  const handleProceed = () => {
    router.replace("/(tabs)" as any);
  };

  if (isSubmitting) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={[styles.heading, { marginTop: 20 }]}>
            Saving your profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/common/logo_v2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.contentContainer}>
            <View style={[styles.iconCircle, { backgroundColor: "#FF4444" }]}>
              <AlertCircle color="#FFFFFF" size={35} strokeWidth={2} />
            </View>
            <View style={styles.textSection}>
              <Text style={styles.heading}>Something went wrong</Text>
              <Text style={styles.subtext}>{error}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={submitProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Logo */}
        <Image
          source={require("@/assets/common/logo_v2.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.contentContainer}>
          {/* Success Check Icon */}
          <View style={styles.iconCircle}>
            <Check color="#FFFFFF" size={35} strokeWidth={3} />
          </View>

          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.heading}>Profile Completed</Text>
            <Text style={styles.subtext}>
              Your profile has been successfully saved!
            </Text>
          </View>

          {/* Main Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleProceed}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
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
    width: width * 1.2,
    height: 250,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -270,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
    elevation: 8,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  textSection: {
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Outfit_700Bold",
  },
  subtext: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Outfit_500Medium",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: width * 0.75,
    height: 44,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    fontFamily: "Outfit_700Bold",
  },
});

export default ProfileCompleted;
