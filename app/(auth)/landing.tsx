import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const LandingPage = () => {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Auto transition to Language Selection after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/language-selection" as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.brandingStack}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/common/logo_v2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Image
            source={require("@/assets/auth/haldi_kumkum.png")}
            style={styles.haldiKumkum}
            resizeMode="contain"
          />

          <Image
            source={require("@/assets/auth/kalash.png")}
            style={styles.kalash}
            resizeMode="contain"
          />
        </View>

        {/* Divider */}
        <Image
          source={require("@/assets/auth/landing_divider.png")}
          style={styles.dividerImage}
          resizeMode="contain"
        />

        {/* Tagline */}
        <View style={styles.taglineBox}>
          <Text style={styles.mainTagline}>Trusted Indian Matrimony</Text>
          <Text style={styles.subTagline}>For Self & Family</Text>
        </View>
      </Animated.View>

      {/* Bottom Progress Bar */}
      <View style={styles.footer}>
        <View style={styles.scrollIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  brandingStack: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    width: width * 0.9,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -40,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  haldiKumkum: {
    width: 230,
    height: 130,
    marginTop: -30,
    zIndex: 11,
  },
  kalash: {
    width: 220,
    height: 280,
    marginTop: -50,
    marginBottom: -10,
    zIndex: 10,
  },
  dividerImage: {
    width: width * 0.95,
    height: 180,
    marginTop: -70,
    marginBottom: 0,
  },
  taglineBox: {
    alignItems: "center",
    marginTop: -50,
  },
  mainTagline: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
  },
  subTagline: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    marginTop: 2,
  },
  footer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  scrollIndicator: {
    width: 50,
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
  },
});

export default LandingPage;
