import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "./components/Button/Button";
import Input from "./components/Input/Input";
import { Colors } from "./utils/colors";
// import { GoogleIcon, FacebookIcon } from './components/SocialIcons'; // Commented out until SocialIcons extracted
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const LoginPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // Renamed from email to identifier
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    let valid = true;
    let newErrors = {};

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
      console.warn("DEBUG: Starting login process...");
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // For development: always succeed and navigate
        router.replace("/(tabs)");

        // Original Logic (Commented out for UI dev):
        /*
                try {
                    const isPhone = /^\d+$/.test(identifier);
                    const payload = {
                        password,
                        ...(isPhone ? { mobile: identifier } : { email: identifier })
                    };
                    // await login(payload);
                    // navigation.navigate('MatchList');
                } catch (error) {
                    console.error("Login failed", error);
                    alert('Login failed. Please check your credentials.');
                }
                */
      }, 1500);
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
                source={require("../../assets/common/logo_v2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/auth/haldi_kumkum.png")}
                style={styles.haldiKumkum}
                resizeMode="contain"
                pointerEvents="none"
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
                  setErrors({ ...errors, password: undefined });
                }}
                icon={<Lock size={20} color={Colors.subtext} />}
                isPassword
                error={errors.password}
              />

              <TouchableOpacity
                style={styles.forgotPass}
                onPress={() => router.push("/forgot-password")}
              >
                <Text style={styles.forgotPassText}>Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title="Log In"
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.loginBtn}
                paddingVertical={10} // Reduced from 14
              />

              {/* Decorative Divider */}
              <Image
                source={require("../../assets/auth/landing_divider.png")}
                style={styles.dividerImage}
                resizeMode="contain"
                pointerEvents="none"
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
                  {/* <GoogleIcon size={22} /> */}
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                  {/* <FacebookIcon size={22} /> */}
                  <Text style={styles.socialBtnText}>Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have any account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
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
    marginBottom: 0, // Removed margin to move divider closer
    borderRadius: 30,
    backgroundColor: Colors.primary,
    zIndex: 50, // Ensure button is above decorative images
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
    marginTop: -40, // Pulled up closer to the design
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
  }, // Reduced from 15
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44, // Reduced height for more compact look
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
