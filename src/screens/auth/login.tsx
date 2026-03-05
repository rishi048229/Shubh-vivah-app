import Button from "@/components/auth/Button";
import Input from "@/components/auth/Input";
import { FacebookIcon, GoogleIcon } from "@/components/auth/SocialIcons";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import * as authService from "@/services/authService";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useRef, useState } from "react";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // OTP state (in case backend requires login OTP verification)
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef<(TextInput | null)[]>([]);

  /**
   * POST /auth/login — Authenticate with email + password.
   * Backend returns { id, token, message }.
   * If token is present → login success.
   * If token is empty but id exists → OTP verification required.
   */
  const handleLogin = async () => {
    let valid = true;
    let newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);
      try {
        const result = await authService.login(email.trim(), password);

        if (result.token) {
          // Direct login success — store token and navigate
          await login(result.token, result.id);
          router.replace("/(tabs)");
        } else if (result.id) {
          // OTP verification needed for login
          setUserId(result.id);
          setStep("otp");
          Alert.alert("OTP Sent", "Please check your email for the verification code.");
        } else {
          Alert.alert("Login Failed", result.message || "No token received from server.");
        }
      } catch (error: any) {
        let message = "Login failed. Please check your credentials.";
        if (
          error.code === "ERR_NETWORK" ||
          error.message?.includes("Network")
        ) {
          message =
            "Cannot connect to server. Please make sure the backend is running.";
        } else if (error.response?.status === 404) {
          message =
            "Server endpoint not found. Please check backend is running.";
        } else if (
          typeof error.response?.data === "string" &&
          error.response.data.includes("<")
        ) {
          message = `Server error (${error.response.status}). Please try again later.`;
        } else {
          message =
            error.response?.data?.message ||
            (typeof error.response?.data === "string"
              ? error.response.data
              : null) ||
            error.message ||
            message;
        }
        Alert.alert("Login Failed", message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * POST /auth/verify-login-otp — Verify OTP for login.
   * Returns { id, token, message }.
   */
  const handleVerifyLoginOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP.");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please try logging in again.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyLoginOtp(userId, otpCode);
      if (result.token) {
        await login(result.token, result.id);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", result.message || "OTP verification failed.");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "OTP verification failed";
      Alert.alert("Error", String(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

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

            <View style={styles.formSection}>
              {/* ===== CREDENTIALS STEP ===== */}
              {step === "credentials" && (
                <>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors({ ...errors, email: undefined });
                    }}
                    icon={<Mail size={20} color={Colors.subtext} />}
                    error={errors.email}
                  />

                  <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: undefined });
                    }}
                    icon={<Lock size={20} color={Colors.subtext} />}
                    isPassword
                    error={errors.password}
                  />

                  <TouchableOpacity
                    style={styles.forgotPass}
                    onPress={() => router.push("/forgot-password" as any)}
                  >
                    <Text style={styles.forgotPassText}>Forgot password?</Text>
                  </TouchableOpacity>

                  <Button
                    title="Log In"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    style={styles.loginBtn}
                    paddingVertical={10}
                  />

                  {/* Decorative Divider */}
                  <Image
                    source={require("@/assets/auth/landing_divider.png")}
                    style={styles.dividerImage}
                    resizeMode="contain"
                  />

                  {/* Social Login Separator */}
                  <View style={styles.socialSeparator}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>Log In With</Text>
                    <View style={styles.separatorLine} />
                  </View>

                  {/* Social Buttons */}
                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                      <GoogleIcon size={22} />
                      <Text style={styles.socialBtnText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                      <FacebookIcon size={22} />
                      <Text style={styles.socialBtnText}>Facebook</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* ===== OTP STEP (if backend requires it for login) ===== */}
              {step === "otp" && (
                <>
                  <View style={styles.otpHeader}>
                    <Text style={styles.otpTitle}>Verify OTP</Text>
                    <Text style={styles.otpSubtitle}>
                      Enter the 6-digit code sent to{"\n"}{email}
                    </Text>
                  </View>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(input) => {
                          otpInputs.current[index] = input;
                        }}
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
                    onPress={handleVerifyLoginOtp}
                    isLoading={isLoading}
                    style={styles.loginBtn}
                    paddingVertical={10}
                  />
                  <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={() => {
                      setStep("credentials");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                  >
                    <Text style={styles.backToLoginText}>Back to login</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have any account? </Text>
            <TouchableOpacity onPress={() => router.push("/register" as any)}>
              <Text style={styles.signUpText}>sign up</Text>
            </TouchableOpacity>
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
    paddingBottom: 20,
  },
  mainContent: { flex: 1 },
  logoSection: { alignItems: "center", marginBottom: 5 },
  logo: { width: width * 0.85, height: 180 },
  haldiKumkum: { width: 240, height: 100, marginTop: -50, zIndex: 10 },
  formSection: { width: "100%", marginTop: 10 },
  forgotPass: { alignSelf: "flex-end", marginBottom: 10 },
  forgotPassText: { color: Colors.primary, fontSize: 13, fontWeight: "600" },
  loginBtn: {
    width: "65%",
    alignSelf: "center",
    marginBottom: 0,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  dividerImage: {
    width: "100%",
    height: 140,
    alignSelf: "center",
    marginTop: -30,
    marginBottom: 10,
  },
  socialSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -40,
    marginBottom: 15,
    width: "100%",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  separatorText: {
    marginHorizontal: 12,
    fontFamily: "Outfit_600SemiBold",
    color: "#757575",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    paddingHorizontal: 15,
    borderColor: "#EFEFEF",
    borderWidth: 1,
    borderRadius: 20,
    width: "48%",
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialBtnText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  // OTP step styles
  otpHeader: { alignItems: "center", marginBottom: 20 },
  otpTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
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
  backToLogin: { alignSelf: "center", paddingVertical: 15 },
  backToLoginText: { color: "#757575", fontSize: 14, fontWeight: "500" },
  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "Outfit_400Regular",
  },
  signUpText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "Outfit_700Bold",
  },
});

export default LoginPage;
