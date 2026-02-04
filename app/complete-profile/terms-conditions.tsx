import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function TermsConditions() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleContinue = () => {
    if (isChecked) {
      router.push("/complete-profile/gender-selection");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and Header Image */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/kalash.jpg")}
            style={styles.decorationImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.headerTitle}>
          Please read and accept our terms and conditions to proceed with
          creating your account and using our platform
        </Text>

        {/* content card */}
        <View style={styles.card}>
          <View style={styles.termsBox}>
            <Text style={styles.termItem}>
              1. Users must be at least 18 years of age to register and use the
              services of ShubhVivah Harmony Hub.
            </Text>
            <Text style={styles.termItem}>
              2. Users agree to provide true, accurate, and complete information
              while creating their profile and using the platform.
            </Text>
            <Text style={styles.termItem}>
              3. ShubhVivah Harmony Hub is not responsible for any false,
              misleading, or incorrect information shared by users on their
              profiles.
            </Text>
            <Text style={styles.termItem}>
              4. By using this platform, users agree to our Privacy Policy
              regarding the collection, storage, and use of personal data.
            </Text>
          </View>
        </View>

        {/* Divider */}
        <Image
          source={require("../../assets/images/design_divider.png")}
          style={styles.divider}
          resizeMode="contain"
        />

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={16} color="#FFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read & agree to the Terms and Conditions
          </Text>
        </TouchableOpacity>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>Accept & Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 10,
  },
  decorationImage: {
    width: 140,
    height: 60,
  },
  headerTitle: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
  },
  termsBox: {
    backgroundColor: "#FFFFF0",
    borderWidth: 1,
    borderColor: "#E5D9C5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  termItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    lineHeight: 20,
    textAlign: "justify",
  },
  divider: {
    width: "80%",
    height: 30,
    marginVertical: 20,
    opacity: 0.8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.light.maroon,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  checkboxChecked: {
    backgroundColor: Colors.light.maroon,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    backgroundColor: Colors.light.maroon,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
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
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
  },
  closeButtonText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "500",
  },
});
