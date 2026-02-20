import CompleteProfileCard from "@/components/Profile/CompleteProfileCard";
import { Colors } from "@/constants/Colors";
import { useProfileForm } from "@/context/ProfileFormContext";
import * as profileService from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { updateFormData } = useProfileForm();

  const [profile, setProfile] = useState<profileService.ProfileData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch profile whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      // Seed the form context for editing
      updateFormData(data as any);
    } catch (error) {
      console.log("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  const handlePickImage = async (type: "main" | "additional") => {
    // Permission check
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: type === "main",
      aspect: type === "main" ? [1, 1] : undefined,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleUpload(result.assets[0].uri, type);
    }
  };

  const handleUpload = async (uri: string, type: "main" | "additional") => {
    setUploading(true);
    try {
      if (type === "main") {
        const url = await profileService.uploadProfilePhoto(uri);
        // Optimistic update
        setProfile((prev) => (prev ? { ...prev, profilePhotoUrl: url } : null));
        Alert.alert("Success", "Profile photo updated!");
      } else {
        const urls = await profileService.uploadAdditionalPhotos([uri]);
        Alert.alert("Success", "Photo added to gallery!");
        loadProfile(); // Reload to get new gallery
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (section: string) => {
    if (!profile) return;

    // Pre-fill context is handled in loadProfile

    switch (section) {
      case "basic": // Edit name, job, location -> Basic Details or Education
        router.push("/complete-profile/basic-details");
        break;
      case "about":
        router.push("/complete-profile/lifestyle-habits"); // Assuming 'About Me' is in lifestyle or basic
        break;
      case "personal":
        router.push("/complete-profile/basic-details");
        break;
      case "family":
        router.push("/complete-profile/family-details");
        break;
      case "horoscope":
        router.push("/complete-profile/religious-details");
        break;
      case "lifestyle":
        router.push("/complete-profile/lifestyle-habits");
        break;
      case "partner":
        // Partner preferences might be a separate screen or part of lifestyle/basic
        // For now, mapping to lifestyle as placeholder or if it exists there
        router.push("/complete-profile/lifestyle-habits");
        break;
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.maroon} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Failed to load profile</Text>
        <TouchableOpacity
          onPress={loadProfile}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: Colors.maroon,
            borderRadius: 5,
            width: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF" }}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: "transparent",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.maroon,
            width: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.maroon }}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate completion percentage (simple heuristic)
  const calculateCompletion = () => {
    let fields = 0;
    let filled = 0;
    if (!profile) return 0;
    const keys = Object.keys(profile) as (keyof profileService.ProfileData)[];
    keys.forEach((k) => {
      // @ts-ignore
      if (
        profile[k] !== null &&
        profile[k] !== "" &&
        k !== "additionalPhotos"
      ) {
        filled++;
      }
      fields++;
    });
    return Math.round((filled / fields) * 100);
  };

  const completion = calculateCompletion();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {profile.fullName || "User Profiles"},{" "}
          {profile.dateOfBirth
            ? new Date().getFullYear() -
              new Date(profile.dateOfBirth).getFullYear()
            : ""}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{
              uri:
                profile.profilePhotoUrl ||
                "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={() => handlePickImage("main")}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={Colors.maroon} />
            ) : (
              <Ionicons name="pencil" size={18} color={Colors.maroon} />
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Info Below Image */}
        <View style={styles.basicInfo}>
          <Text style={styles.profileName}>
            {profile.fullName},{" "}
            {profile.dateOfBirth
              ? new Date().getFullYear() -
                new Date(profile.dateOfBirth).getFullYear()
              : "N/A"}
          </Text>
          <Text style={styles.profession}>
            {profile.occupation || "Not Specified"},{" "}
            {profile.annualIncome ? `${profile.annualIncome} LPA` : ""}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.locationText}>
              {profile.city || "Location not set"}
            </Text>
          </View>

          {/* Profile Status and Likes */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Profile Status</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${completion}%` }]}
                />
              </View>
              <Text style={styles.statValue}>{completion}%</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={Colors.maroon} />
              <Text style={styles.likesText}>0 Likes</Text>
            </View>
          </View>
        </View>

        {/* Complete Profile Card (CTA if low percentage) */}
        {completion < 100 && <CompleteProfileCard />}

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              About {profile.fullName?.split(" ")[0] || "Me"}
            </Text>
            <TouchableOpacity onPress={() => handleEdit("about")}>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.aboutText}>
            {profile.aboutMe || "Tell us about yourself..."}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => handleEdit("personal")}>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow
              label="Height"
              value={profile.height ? `${profile.height} cm` : "Not set"}
            />
            <InfoRow label="Mother Tongue" value="Hindi" />
            <InfoRow label="Religion" value={profile.religion || "Not set"} />
            <InfoRow label="Caste" value={profile.caste || "Not set"} />
            <InfoRow label="Sub Caste" value="Not set" />
            <InfoRow
              label="Education"
              value={profile.highestEducation || "Not set"}
            />
            <InfoRow
              label="Occupation"
              value={profile.occupation || "Not set"}
            />
            <InfoRow
              label="Annual Income"
              value={
                profile.annualIncome ? `${profile.annualIncome} LPA` : "Not set"
              }
            />
          </View>
        </View>

        {/* Family */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family</Text>
            <TouchableOpacity onPress={() => handleEdit("family")}>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow
              label="Father"
              value={profile.fatherOccupation || "Not set"}
            />
            <InfoRow
              label="Mother"
              value={profile.motherOccupation || "Not set"}
            />
            <InfoRow
              label="Siblings"
              value={`${profile.brothers || 0} Brother(s), ${profile.sisters || 0} Sister(s)`}
            />
            <InfoRow
              label="Family Type"
              value={profile.familyType || "Not set"}
            />
            <InfoRow
              label="Family Values"
              value={profile.familyValues || "Not set"}
            />
            <InfoRow label="Native Place" value={profile.city || "Not set"} />
          </View>
        </View>

        {/* Horoscope (Religious Details) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horoscope</Text>
            <TouchableOpacity onPress={() => handleEdit("horoscope")}>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Rashi" value={profile.rashi || "Not set"} />
            <InfoRow label="Nakshatra" value={profile.nakshatra || "Not set"} />
            <InfoRow
              label="Manglik"
              value={profile.manglikStatus || "Not set"}
            />
            <InfoRow
              label="Date of Birth"
              value={profile.dateOfBirth || "Not set"}
            />
            <InfoRow label="Birth Place" value={profile.city || "Not set"} />
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <TouchableOpacity onPress={() => handleEdit("lifestyle")}>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow
              label="Eating Habits"
              value={profile.eatingHabits || "Not set"}
            />
            <InfoRow label="Diet" value={profile.dietPreference || "Not set"} />
            <InfoRow label="Drinking" value={profile.drinking ? "Yes" : "No"} />
            <InfoRow label="Smoking" value={profile.smoking ? "Yes" : "No"} />
          </View>
        </View>

        {/* Additional Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Additional Photos</Text>
            <View style={styles.photoCounter}>
              <Text style={styles.photoCounterText}>
                {profile.additionalPhotos?.length || 0}/5
              </Text>
            </View>
          </View>
          <Text style={styles.photoSubtitle}>
            Add up to 5 Photos to showcase yourself better
          </Text>
          <View style={styles.photoGrid}>
            <TouchableOpacity
              style={styles.addPhotoBox}
              onPress={() => handlePickImage("additional")}
            >
              {uploading ? (
                <ActivityIndicator color={Colors.maroon} />
              ) : (
                <Ionicons name="add" size={32} color={Colors.maroon} />
              )}
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {profile.additionalPhotos &&
              profile.additionalPhotos.map((photoUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: photoUrl }}
                  style={styles.galleryPhoto}
                />
              ))}

            {/* Empty placeholders */}
            {Array.from({
              length: Math.max(0, 4 - (profile.additionalPhotos?.length || 0)),
            }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.emptyPhotoBox}>
                <Ionicons name="image-outline" size={32} color="#CCC" />
              </View>
            ))}
          </View>
        </View>

        {/* Safety & Trust */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety & Trust</Text>
          </View>
          <View style={styles.verificationGrid}>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationLabel}>Profile Verified</Text>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationLabel}>ID Verified</Text>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationLabel}>Phone Verified</Text>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={infoRowStyles.container}>
    <Text style={infoRowStyles.label}>{label}</Text>
    <Text style={infoRowStyles.value}>{value}</Text>
  </View>
);

const infoRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontSize: 14,
    color: Colors.maroon,
    fontWeight: "600",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1.5,
    textAlign: "left",
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.ivory,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D1406",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: Colors.maroon,
  },
  editImageButton: {
    position: "absolute",
    bottom: 5,
    right: width / 2 - 80,
    backgroundColor: "#FFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.maroon,
  },
  basicInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 4,
  },
  profession: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  progressBar: {
    width: 120,
    height: 6,
    backgroundColor: "#F0E6D2",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.maroon,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D1406",
  },
  likesText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.maroon,
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.maroon,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D1406",
  },
  aboutText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  readMore: {
    color: Colors.maroon,
    fontWeight: "600",
  },
  infoGrid: {
    gap: 2,
  },
  photoCounter: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCounterText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  photoSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  addPhotoBox: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.maroon,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  addPhotoText: {
    color: Colors.maroon,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyPhotoBox: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryPhoto: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    borderRadius: 12,
  },
  verificationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    flex: 1,
    minWidth: "45%",
  },
  verificationLabel: {
    fontSize: 13,
    color: Colors.maroon,
    fontWeight: "600",
  },
});
