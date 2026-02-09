import { AdditionalPhotosCard } from "@/components/profile/AdditionalPhotosCard";
import { ProfileCompletionCTA } from "@/components/profile/ProfileCompletionCTA";
import { ProfileCompletionOverlay } from "@/components/profile/ProfileCompletionOverlay";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoCards } from "@/components/profile/ProfileInfoCards";
import { ProfileSettingsCard } from "@/components/profile/ProfileSettingsCard";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { SafetyTrustCard } from "@/components/profile/SafetyTrustCard";
import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ProfileScreen() {
  const router = useRouter();
  const { profileData, completionPercentage, isLoading, isProfileComplete } =
    useProfile();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Calculate age from DOB
  const calculateAge = (dob?: string): number | undefined => {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.maroon} />
      </View>
    );
  }

  const userName = profileData.fullName || "Complete Your Profile";
  const userAge = calculateAge(profileData.dateOfBirth);
  const userCity = profileData.city;
  const userProfession = profileData.occupation;

  return (
    <View style={styles.container}>
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Profile Header - New Design */}
        <ProfileHeader
          name={userName}
          age={userAge}
          city={userCity}
          profession={userProfession}
          isVerified={false}
        />

        {/* Profile Completion CTA - Original component (backend connection preserved) */}
        {!isProfileComplete && (
          <View style={styles.ctaContainer}>
            <ProfileCompletionCTA
              completionPercentage={completionPercentage}
              onPress={() => router.push("/complete-profile/terms-conditions")}
            />
          </View>
        )}

        {/* Profile Stats */}
        <ProfileStatsCard />

        {/* Pill-Style Information Cards */}
        <ProfileInfoCards />

        {/* Additional Photos Gallery (Max 5) */}
        <AdditionalPhotosCard />

        {/* Safety & Trust Section */}
        <SafetyTrustCard lastActive="Just now" />

        {/* Settings Card with Toggles */}
        <ProfileSettingsCard />
      </AnimatedScrollView>

      {/* Profile Completion Overlay - Shows when incomplete */}
      <ProfileCompletionOverlay
        completionPercentage={completionPercentage}
        isVisible={!isProfileComplete && completionPercentage < 50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.warmBeige,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.warmBeige,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  ctaContainer: {
    marginTop: -15,
    marginBottom: 5,
  },
});
