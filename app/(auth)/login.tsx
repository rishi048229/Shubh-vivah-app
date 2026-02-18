import Button from "@/components/auth/Button";
import Input from "@/components/auth/Input";
import { FacebookIcon, GoogleIcon } from "@/components/auth/SocialIcons";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import * as authService from "@/services/authService";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
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

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const handleTestConnection = async () => {
    try {
      const response = await api.get("/auth/health"); // Assuming this exists or similar public endpoint
      Alert.alert(
        "Connection Successful",
        `Status: ${response.status}\nURL: ${api.defaults.baseURL}`,
      );
    } catch (error: any) {
      let message = "Connection Failed";
      if (error.code === "ERR_NETWORK") {
        message = `Network Error. Cannot reach ${api.defaults.baseURL}`;
      } else if (error.response) {
        message = `Server Error: ${error.response.status}`;
      }
      Alert.alert(
        "Connection Failed",
        `${message}\n\nURL: ${api.defaults.baseURL}`,
      );
    }
  };

  const handleLogin = async () => {
    let valid = true;
    let newErrors: { identifier?: string; password?: string } = {};

    if (!identifier) {
      newErrors.identifier = "Mobile number or Email is required";
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
        const result = await authService.login(identifier.trim(), password);
        if (result.token) {
          await login(result.token);
          router.replace("/(tabs)");
        } else {
          Alert.alert("Login Failed", "No token received from server.");
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
          // HTML error page — don't show raw HTML
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
              <Input
                placeholder="Email or Phone Number"
                value={identifier}
                onChangeText={(text) => {
                  setIdentifier(text);
                  setErrors({ ...errors, identifier: undefined });
                }}
                icon={<Mail size={20} color={Colors.subtext} />}
                error={errors.identifier}
              />

              <Input
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  errors.password = undefined; // Direct mutation fix or use setErrors
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
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have any account? </Text>
            <TouchableOpacity onPress={() => router.push("/register" as any)}>
              <Text style={styles.signUpText}>sign up</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: "#999" }}>
              API: {api.defaults.baseURL}
            </Text>
            <TouchableOpacity
              onPress={handleTestConnection}
              style={{
                marginTop: 5,
                padding: 10,
                backgroundColor: "#eee",
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 10 }}>Test Connection</Text>
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
