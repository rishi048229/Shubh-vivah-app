import { authService } from "@/services/authService";
import { useNavigation } from "@react-navigation/native";
import { Check, Lock, Mail } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./components/Button/Button";
import Input from "./components/Input/Input";
import { Colors } from "./utils/colors";
import { getPasswordError } from "./utils/validators";

const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState("request"); // request, verify, verified_success, reset_input, final_success
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const otpInputs = useRef([]);

  const handleSendOtp = async () => {
    if (!identifier) {
      setErrors({ identifier: "Email or Mobile is required" });
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPasswordOtp(identifier);
      setStep("verify");
    } catch (error) {
      console.error("Send forgot password OTP failed", error);
      const msg = error.response?.data?.message || "Failed to send OTP";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      await authService.verifyForgotPasswordOtp(identifier, otpCode);
      setStep("verified_success");
    } catch (error) {
      console.error("Verify OTP failed", error);
      const msg = error.response?.data?.message || "Invalid OTP";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords don't match" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(identifier, newPassword);
      setStep("final_success");
    } catch (error) {
      console.error("Reset password failed", error);
      const msg = error.response?.data?.message || "Failed to reset password";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const renderHeader = () => (
    <View style={styles.logoSection}>
      <Image
        source={require("../../assets/common/logo_v2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/auth/haldi_kumkum.png")}
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
              {step === "request" && (
                <>
                  <View style={styles.textCenter}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                      Enter your registered email or mobile number
                    </Text>
                  </View>
                  <Input
                    placeholder="Email / Mobile"
                    value={identifier}
                    onChangeText={setIdentifier}
                    icon={<Mail size={20} color={Colors.subtext} />}
                  />
                  <Button
                    title="Send OTP"
                    onPress={handleSendOtp}
                    isLoading={isLoading}
                    style={styles.actionBtn}
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate("login")}
                    style={styles.backLink}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backLinkText}>Back to login</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === "verify" && (
                <>
                  <View style={styles.textCenter}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                      We have sent a 6-digit code to{"\n"}
                      {identifier}
                    </Text>
                  </View>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(input) => (otpInputs.current[index] = input)}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      />
                    ))}
                  </View>
                  <Button
                    title="Verify"
                    onPress={handleVerifyOtp}
                    isLoading={isLoading}
                    style={styles.actionBtn}
                  />
                  <TouchableOpacity style={styles.resendLink}>
                    <Text style={styles.resendText}>Resend Code</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === "verified_success" && (
                <>
                  <View style={styles.successIconContainer}>
                    <View style={styles.circleCheck}>
                      <Check size={40} color="#FFF" strokeWidth={3} />
                    </View>
                  </View>
                  <View style={styles.textCenter}>
                    <Text style={[styles.title, styles.boldTitle]}>
                      OTP Verified Successfully
                    </Text>
                    <Text style={styles.subtitle}>
                      You can now reset your password
                    </Text>
                  </View>
                  <Button
                    title="Continue"
                    onPress={() => setStep("reset_input")}
                    style={[styles.actionBtn, { width: "50%" }]}
                  />
                </>
              )}

              {step === "reset_input" && (
                <>
                  <View style={styles.textCenter}>
                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>
                      Please enter and confirm your new password below
                    </Text>
                  </View>
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
                    onPress={handleSetNewPassword}
                    isLoading={isLoading}
                    style={styles.actionBtn}
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate("login")}
                    style={styles.backLink}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backLinkText}>Back to login</Text>
                  </TouchableOpacity>
                </>
              )}

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
                    title="Back to login"
                    onPress={() => navigation.navigate("login")}
                    style={[styles.actionBtn, { width: "50%" }]}
                  />
                </>
              )}
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Image
              source={require("../../assets/auth/landing_divider.png")}
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
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
  bottomSection: { width: "100%", alignItems: "center", paddingBottom: 15 },
  resendLink: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ForgotPassword;
