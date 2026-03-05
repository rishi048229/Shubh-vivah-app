import Button from "@/components/auth/Button";
import Input from "@/components/auth/Input";
import { Colors } from "@/constants/Colors";
import * as authService from "@/services/authService";
import { getPasswordError } from "@/utils/validators";
import { useRouter } from "expo-router";
import { Check, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Step 1: POST /auth/forgot-password
   * Backend sends a reset token/email. Returns { message, token }.
   */
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(email.trim());
      // Backend may return a reset token directly or send via email
      if (result.token) {
        setResetToken(result.token);
      }
      Alert.alert(
        "Reset Email Sent",
        result.message || "Check your email for the password reset link."
      );
      setStep("reset_input");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to send reset email";
      Alert.alert("Error", String(msg));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: POST /auth/reset-password
   * Sends { token, newPassword } to reset the password.
   */
  const handleResetPassword = async () => {
    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords don't match" });
      return;
    }

    // Use the token from forgot-password response, or let user paste it
    const token = resetToken.trim();
    if (!token) {
      Alert.alert("Error", "Reset token is missing. Please check your email for the reset link.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setStep("final_success");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to reset password";
      Alert.alert("Error", String(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.logoSection}>
      <Image
        source={require("@/assets/common/logo_v2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Image
        source={require("@/assets/auth/haldi_kumkum.png")}
        style={styles.haldiKumkum}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            {renderHeader()}

            <View style={styles.formSection}>
              {/* ===== STEP 1: ENTER EMAIL ===== */}
              {step === "request" && (
                <>
                  <View style={styles.textCenter}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                      Enter your registered email address
                    </Text>
                  </View>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    icon={<Mail size={20} color={Colors.subtext} />}
                  />
                  <Button
                    title="Send Reset Link"
                    onPress={handleForgotPassword}
                    isLoading={isLoading}
                    style={styles.actionBtn}
                  />
                  <TouchableOpacity
                    onPress={() => router.push("/login" as any)}
                    style={styles.backLink}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backLinkText}>Back to login</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ===== STEP 2: NEW PASSWORD ===== */}
              {step === "reset_input" && (
                <>
                  <View style={styles.textCenter}>
                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>
                      Enter the reset token from your email and set a new password
                    </Text>
                  </View>

                  {/* Show token input only if we don't already have it */}
                  {!resetToken && (
                    <Input
                      placeholder="Reset Token (from email)"
                      value={resetToken}
                      onChangeText={setResetToken}
                      icon={<Lock size={20} color={Colors.subtext} />}
                    />
                  )}

                  <Input
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setErrors({ ...errors, password: undefined });
                    }}
                    icon={<Lock size={20} color={Colors.subtext} />}
                    isPassword
                    error={errors.password}
                  />
                  <Input
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    icon={<Lock size={20} color={Colors.subtext} />}
                    isPassword
                    error={errors.confirmPassword}
                  />
                  <Button
                    title="Change Password"
                    onPress={handleResetPassword}
                    isLoading={isLoading}
                    style={styles.actionBtn}
                  />
                  <TouchableOpacity
                    onPress={() => router.push("/login" as any)}
                    style={styles.backLink}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backLinkText}>Back to login</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ===== STEP 3: SUCCESS ===== */}
              {step === "final_success" && (
                <>
                  <View style={styles.successIconContainer}>
                    <View style={styles.circleCheck}>
                      <Check size={40} color="#FFF" strokeWidth={3} />
                    </View>
                  </View>
                  <View style={styles.textCenter}>
                    <Text style={[styles.title, styles.boldTitle]}>
                      Password Updated
                    </Text>
                    <Text style={styles.subtitle}>
                      You can log in with your new password
                    </Text>
                  </View>
                  <Button
                    title="Back to Login"
                    onPress={() => router.push("/login" as any)}
                    style={{ ...styles.actionBtn, width: "50%" }}
                  />
                </>
              )}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Image
              source={require("@/assets/auth/landing_divider.png")}
              style={styles.dividerImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 25,
  },
  mainContent: { flex: 1 },
  logoSection: { alignItems: "center", marginBottom: 5 },
  logo: { width: width * 0.85, height: 180 },
  haldiKumkum: { width: 240, height: 100, marginTop: -50, zIndex: 10 },
  formSection: { width: "100%", alignItems: "center", marginTop: 10 },
  textCenter: { alignItems: "center", marginBottom: 25 },
  boldTitle: { fontWeight: "700" },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
  },
  actionBtn: {
    width: "65%",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  backLink: {
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "transparent",
  },
  backLinkText: { color: "#757575", fontSize: 14, fontWeight: "500" },
  successIconContainer: { marginBottom: 25, alignItems: "center" },
  circleCheck: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dividerImage: {
    width: "100%",
    height: 180,
    alignSelf: "center",
    marginTop: -100,
    marginBottom: 10,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 15,
  },
});

export default ForgotPassword;
