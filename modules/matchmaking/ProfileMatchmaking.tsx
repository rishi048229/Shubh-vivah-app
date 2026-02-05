import { Colors } from "@/constants/Colors";
import { ProfileDto, profileService } from "@/services/profileService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AboutMeSection } from "./components/AboutMeSection";
import { PhotoGallery } from "./components/PhotoGallery";
import { ProfileCompletionCTA } from "./components/ProfileCompletionCTA";
import { ProfileHero } from "./components/ProfileHero";
import { SettingsSection } from "./components/SettingsSection";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: any) {
      console.log("Profile fetch error:", err.response?.status);
      // 404 or 403 means profile not yet created - that's okay
      if (err.response?.status === 404 || err.response?.status === 403) {
        setProfile(null);
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completion percentage based on filled fields
  const calculateCompletion = (): number => {
    if (!profile) return 0;

    const fields = [
      profile.fullName,
      profile.gender,
      profile.dateOfBirth,
      profile.height,
      profile.weight,
      profile.city,
      profile.religion,
      profile.community,
      profile.caste,
      profile.highestEducation,
      profile.occupation,
      profile.fatherOccupation,
      profile.motherOccupation,
      profile.familyType,
      profile.eatingHabits,
      profile.aboutMe,
    ];

    const filled = fields.filter(
      (f) => f !== undefined && f !== null && f !== "",
    ).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();

  // Build display data from profile
  const displayData = {
    name: profile?.fullName || "Complete Your Profile",
    location: profile?.city ? `${profile.city}, India` : "Location not set",
    image: "https://i.pravatar.cc/300?img=11", // Placeholder for now
    stats: {
      shortlisted: 0,
      views: 0,
      messages: 0,
    },
    images: [
      "https://i.pravatar.cc/300?img=11",
      "https://i.pravatar.cc/300?img=12",
      "https://i.pravatar.cc/300?img=13",
      "https://i.pravatar.cc/300?img=14",
    ],
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.maroon} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHero
          name={displayData.name}
          location={displayData.location}
          image={displayData.image}
          completionPercentage={completion}
          stats={displayData.stats}
        />

        <View style={styles.content}>
          <ProfileCompletionCTA
            completionPercentage={completion}
            onPress={() => router.push("/complete-profile/terms-conditions")}
          />

          <View style={styles.spacer} />

          <PhotoGallery
            images={displayData.images}
            onAddPhoto={() => console.log("Add photo")}
          />

          <AboutMeSection completionPercentage={completion} />

          <SettingsSection />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});
