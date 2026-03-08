import ProfileDataSection from "@/components/ProfileDataSection";
import { useThemedAlert } from "@/components/ThemedAlert";
import { Colors } from "@/constants/Colors";
import {
  likeUser,
  sendRequest,
  shortlistUser,
  viewFullProfile,
} from "@/services/matchService";
import { getAvatarUrl } from "@/utils/avatar";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = Number(params.id);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const { showAlert, AlertComponent } = useThemedAlert();

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await viewFullProfile(userId);
      setProfile(data);
    } catch (e) {
      console.log("Failed to load profile:", e);
      showAlert("Error", "Could not load profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      setActionLoading("like");
      await likeUser(userId);
      showAlert("Liked!", `You liked ${profile?.fullName || "this user"}`, "success");
    } catch (e: any) {
      showAlert("Info", e?.response?.data || "Already liked or action failed.", "info");
    } finally {
      setActionLoading("");
    }
  };

  const handleShortlist = async () => {
    try {
      setActionLoading("shortlist");
      await shortlistUser(userId);
      showAlert("Shortlisted!", `${profile?.fullName || "User"} added to your shortlist.`, "success");
    } catch (e: any) {
      showAlert("Info", e?.response?.data || "Already shortlisted.", "info");
    } finally {
      setActionLoading("");
    }
  };

  const handleSendRequest = async () => {
    try {
      setActionLoading("request");
      await sendRequest(userId);
      showAlert("Request Sent! 💌", `Your connection request has been sent to ${profile?.fullName || "this user"}.`, "success");
    } catch (e: any) {
      showAlert("Info", e?.response?.data || "Request already sent.", "info");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.maroon} />
        <Text style={{ marginTop: 12, color: "#999" }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="person-outline" size={48} color="#CCC" />
        <Text style={{ marginTop: 12, color: "#999" }}>Profile not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.maroon, marginTop: 12, fontWeight: "600" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Map profile data to sections
  const personalData = [
    profile.height && { label: "Height", value: profile.height },
    profile.motherTongue && { label: "Mother Tongue", value: profile.motherTongue },
    profile.religion && { label: "Religion", value: profile.religion },
    profile.community && { label: "Community", value: profile.community },
    profile.caste && { label: "Caste", value: profile.caste },
    profile.education && { label: "Education", value: profile.education },
    profile.occupation && { label: "Occupation", value: profile.occupation },
    profile.income && { label: "Income", value: profile.income },
    profile.maritalStatus && { label: "Marital Status", value: profile.maritalStatus },
  ].filter(Boolean);

  const familyData = [
    profile.fatherName && { label: "Father", value: profile.fatherName },
    profile.fatherOccupation && { label: "Father's Occupation", value: profile.fatherOccupation },
    profile.motherName && { label: "Mother", value: profile.motherName },
    profile.motherOccupation && { label: "Mother's Occupation", value: profile.motherOccupation },
    profile.siblings && { label: "Siblings", value: profile.siblings },
    profile.familyType && { label: "Family Type", value: profile.familyType },
    profile.familyValues && { label: "Family Values", value: profile.familyValues },
  ].filter(Boolean);

  const horoscopeData = [
    profile.manglik && { label: "Manglik", value: profile.manglik },
    profile.dateOfBirth && { label: "Birth Date", value: profile.dateOfBirth },
    profile.birthTime && { label: "Birth Time", value: profile.birthTime },
    profile.rashi && { label: "Rashi", value: profile.rashi },
    profile.nakshatra && { label: "Nakshatra", value: profile.nakshatra },
    profile.gotra && { label: "Gotra", value: profile.gotra },
  ].filter(Boolean);

  const lifestyleData = [
    profile.diet && { label: "Diet", value: profile.diet },
    profile.smoking && { label: "Smoking", value: profile.smoking },
    profile.drinking && { label: "Drinking", value: profile.drinking },
    profile.hobbies && { label: "Hobbies", value: profile.hobbies },
  ].filter(Boolean);

  const partnerData = [
    profile.partnerAgeRange && { label: "Age Range", value: profile.partnerAgeRange },
    profile.partnerHeight && { label: "Preferred Height", value: profile.partnerHeight },
    profile.partnerOccupation && { label: "Preferred Occupation", value: profile.partnerOccupation },
    profile.partnerLocation && { label: "Preferred Location", value: profile.partnerLocation },
    profile.partnerCommunity && { label: "Community Preference", value: profile.partnerCommunity },
  ].filter(Boolean);

  const displayName = profile.fullName || "User";
  const firstName = displayName.split(" ")[0];
  const photoUrl = getAvatarUrl(
    profile.profilePhotoUrl || (profile.photos && profile.photos[0]),
    profile.gender,
    profile.fullName
  );

  return (
    <View style={styles.container}>
      <AlertComponent />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {displayName}
          {profile.age ? `, ${profile.age}` : ""}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Animated.View
          entering={FadeInUp.duration(500).springify()}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {profile.matchScore && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>
                {profile.matchScore}% Match
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Basic Info */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.basicInfoContainer}
        >
          <Text style={styles.name}>
            {displayName}
            {profile.age ? `, ${profile.age}` : ""}
          </Text>
          <Text style={styles.subtext}>
            {[profile.occupation, profile.income].filter(Boolean).join(" • ") ||
              "No occupation listed"}
          </Text>

          {profile.city && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#D32F2F" />
              <Text style={styles.locationText}>{profile.city}</Text>
              {profile.distanceText && (
                <Text style={styles.distanceText}> • {profile.distanceText}</Text>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSendRequest}
              disabled={actionLoading === "request"}
            >
              {actionLoading === "request" ? (
                <ActivityIndicator size="small" color="#D32F2F" />
              ) : (
                <Ionicons name="heart" size={20} color="#D32F2F" />
              )}
              <Text style={styles.actionText}>Interest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShortlist}
              disabled={actionLoading === "shortlist"}
            >
              {actionLoading === "shortlist" ? (
                <ActivityIndicator size="small" color="#FFD700" />
              ) : (
                <Ionicons name="star" size={20} color="#FFD700" />
              )}
              <Text style={styles.actionText}>Shortlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              disabled={actionLoading === "like"}
            >
              {actionLoading === "like" ? (
                <ActivityIndicator size="small" color="#D32F2F" />
              ) : (
                <Ionicons name="thumbs-up" size={20} color="#D32F2F" />
              )}
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* About Section */}
        {profile.about && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.sectionContainer}
          >
            <Text style={styles.sectionTitle}>About {firstName}</Text>
            <View style={styles.aboutBox}>
              <Text style={styles.aboutText}>{profile.about}</Text>
            </View>
          </Animated.View>
        )}

        {/* Dynamic Data Sections */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.paddingContainer}
        >
          {personalData.length > 0 && (
            <ProfileDataSection
              title="Personal Information"
              data={personalData}
            />
          )}
          {familyData.length > 0 && (
            <ProfileDataSection title="Family" data={familyData} />
          )}
          {horoscopeData.length > 0 && (
            <ProfileDataSection title="Horoscope" data={horoscopeData} />
          )}
          {lifestyleData.length > 0 && (
            <ProfileDataSection title="Lifestyle" data={lifestyleData} />
          )}
          {partnerData.length > 0 && (
            <ProfileDataSection
              title="Partner Preference"
              data={partnerData}
            />
          )}
        </Animated.View>

        {/* Bottom Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
    paddingTop: Constants.statusBarHeight,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.ivory,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: width - 30,
    height: 350,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(128,0,0,0.85)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  matchBadgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  basicInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    marginLeft: 5,
    color: "#333",
    fontSize: 14,
  },
  distanceText: {
    color: "#999",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#EBD8B2",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D32F2F",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  aboutBox: {
    borderWidth: 1,
    borderColor: "#D32F2F",
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#FFF8E7",
  },
  aboutText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  paddingContainer: {
    paddingHorizontal: 20,
  },
});
