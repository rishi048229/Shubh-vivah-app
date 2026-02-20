import ProfileDataSection from "@/components/ProfileDataSection";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // In a real app, use params.id to fetch data. Using dummy data for now.

  const dummyData = {
    name: "Anjali Sharma",
    age: "21",
    job: "Software Engineer",
    salary: "4 LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    about:
      "Hi, I'm Anjali Sharma. Based in mumbai. I'm a Software Engineer who values family & career equally. I lead an active lifestyle, enjoy exploring new cuisines and have a pass...",
  };

  const familyData = [
    { label: "Father", value: "Rajesh Sharma, Businessman" },
    { label: "Mother", value: "Sunita Sharma, Homemaker" },
    { label: "Sibling's", value: "1 Brother, 0 Sister" },
    { label: "Family Type", value: "Nuclear" },
    { label: "Family Values", value: "Moderate" },
    { label: "Native Place", value: "Mumbai" },
  ];

  const horoscopeData = [
    { label: "Horoscope Available", value: "Yes" },
    { label: "Manglik", value: "No" },
    { label: "Birth Date", value: "10-10-2005" },
    { label: "Birth Place", value: "Rahata" },
  ];

  const lifestyleData = [
    { label: "Non Vegetarian", value: "Yes" },
    { label: "Hobbies", value: "Travel, Music, Cooking." },
  ];

  const partnerData = [
    { label: "Age Range", value: "24-28 Years" },
    { label: "Preferred Height", value: "5'6\" To 6'2\"" },
    { label: "Preferred Occupation", value: "Engineer, MBA or Similar" },
    { label: "Preferred Location", value: "Mumbai, Pune" },
    {
      label: "Community Preference",
      value: "Brahmin / Open to similar Communities",
    },
  ];

  const personalData = [
    { label: "Height", value: "5'6\"" },
    { label: "Mother Tongue", value: "Hindi" },
    { label: "Religion", value: "Hindu" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {dummyData.name} , {dummyData.age}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: dummyData.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfoContainer}>
          <Text style={styles.name}>
            {dummyData.name} , {dummyData.age}
          </Text>
          <Text style={styles.subtext}>
            {dummyData.job} , {dummyData.salary}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#D32F2F" />
            <Text style={styles.locationText}>{dummyData.location}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart" size={20} color="#D32F2F" />
              <Text style={styles.actionText}>Interest</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.actionText}>Shortlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart" size={20} color="#D32F2F" />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About Anjali</Text>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>
              {dummyData.about}
              <Text style={{ fontWeight: "bold", color: "#000" }}>
                Read More
              </Text>
            </Text>
          </View>
        </View>

        {/* Dynamic Data Sections */}
        <View style={styles.paddingContainer}>
          <ProfileDataSection
            title="Personal Information"
            data={personalData}
          />
          <ProfileDataSection title="Family" data={familyData} />
          <ProfileDataSection title="Horoscope" data={horoscopeData} />
          <ProfileDataSection title="Lifestyle" data={lifestyleData} />
          <ProfileDataSection title="Partner Preference" data={partnerData} />
        </View>

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
    width: width - 30, // margin adjustment
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
