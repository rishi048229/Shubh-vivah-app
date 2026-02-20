import { COLORS } from "@/components/Profile/CompleteProfileForm";
import { useRouter } from "expo-router";
import { CheckSquare, Square } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TermsConditions = () => {
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    if (!isAccepted) {
      Alert.alert(
        "Attention",
        "Please accept the Terms & Conditions to continue",
      );
      return;
    }
    router.push("/complete-profile/select-gender" as any);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require("@/assets/common/logo_v2.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Haldi Kumkum */}
        <Image
          source={require("@/assets/auth/haldi_kumkum_v2.png")}
          style={styles.kumkum}
          resizeMode="contain"
        />

        {/* Heading Text */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingLine1}>
            Please read and accept our terms and conditions to
          </Text>
          <Text style={styles.headingLine2}>
            proceed with creating your account and using our
          </Text>
          <Text style={styles.headingLine3}>platform</Text>
        </View>

        {/* Terms Box */}
        <View style={styles.termsBox}>
          <View style={styles.termsItem}>
            <Text style={styles.termsText}>
              1. Users must be at least 18 years of age to register and use the
              services of ShubhVivah Harmony Hub.
            </Text>
          </View>
          <View style={styles.termsItem}>
            <Text style={styles.termsText}>
              2. Users agree to provide true, accurate, and complete information
              while creating their profile and using the platform.
            </Text>
          </View>
          <View style={styles.termsItem}>
            <Text style={styles.termsText}>
              3. ShubhVivah Harmony Hub is not responsible for any false,
              misleading, or incorrect information shared by users on their
              profiles.
            </Text>
          </View>
          <View style={styles.termsItem}>
            <Text style={styles.termsText}>
              4. By using this platform, users agree to our Privacy Policy
              regarding the collection, storage, and use of personal data.
            </Text>
          </View>
        </View>

        {/* Divider */}
        <Image
          source={require("@/assets/auth/landing_divider.png")}
          style={styles.divider}
          resizeMode="contain"
        />

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsAccepted(!isAccepted)}
          activeOpacity={0.7}
        >
          {isAccepted ? (
            <CheckSquare size={20} color={COLORS.PRIMARY} />
          ) : (
            <Square size={20} color={COLORS.PRIMARY} />
          )}
          <Text style={styles.checkboxText}>
            I have read & agree to the Terms and Conditions
          </Text>
        </TouchableOpacity>

        {/* Accept Button */}
        <TouchableOpacity
          style={[
            styles.acceptButton,
            !isAccepted && styles.acceptButtonDisabled,
          ]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>Accept & Continue</Text>
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 15,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  logo: {
    width: 450,
    height: 180,
    marginBottom: -55,
  },
  kumkum: {
    width: 150,
    height: 100,
    marginBottom: 10,
  },
  headingContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    marginTop: -30,
  },
  headingLine1: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    fontWeight: "normal",
    width: "100%",
    fontFamily: "Outfit_400Regular",
  },
  headingLine2: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    fontWeight: "normal",
    marginTop: 3,
    width: "100%",
    fontFamily: "Outfit_400Regular",
  },
  headingLine3: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    fontWeight: "normal",
    marginTop: 3,
    width: "100%",
    fontFamily: "Outfit_400Regular",
  },
  termsBox: {
    width: "100%",
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: "#E6D5B8",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  termsItem: {
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    textAlign: "left",
    fontFamily: "Outfit_400Regular",
  },
  divider: {
    width: "180%",
    height: 200,
    marginBottom: 0,
    marginTop: -90,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: -75,
    paddingHorizontal: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    fontFamily: "Outfit_500Medium",
  },
  acceptButton: {
    width: 300,
    backgroundColor: COLORS.PRIMARY,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
  },
  closeButton: {
    width: 200,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6D5B8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
  },
});

export default TermsConditions;
