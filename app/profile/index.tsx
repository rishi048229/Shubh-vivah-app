import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rahul More , 25</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="pencil" size={18} color={Colors.maroon} />
          </TouchableOpacity>
        </View>

        {/* Basic Info Below Image */}
        <View style={styles.basicInfo}>
          <Text style={styles.profileName}>Rahul More , 25</Text>
          <Text style={styles.profession}>Software Engineer , 4 LPA</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.locationText}>Mumbai</Text>
          </View>

          {/* Profile Status and Likes */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Profile Status</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "75%" }]} />
              </View>
              <Text style={styles.statValue}>75%</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={Colors.maroon} />
              <Text style={styles.likesText}>465 Likes</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Anjali</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.aboutText}>
            Hi , I'm Anjali Sharma. Based in mumbai. I'm a Software Engineer who
            values family & career equally . I lead an active lifestyle , enjoy
            exploring new cuisines and have a pass...
            <Text style={styles.readMore}>Read More</Text>
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Height" value={`5'6"`} />
            <InfoRow label="Mother Tongue" value="Hindi" />
            <InfoRow label="Religion" value="Hindu" />
            <InfoRow label="Caste" value="Brahmin" />
            <InfoRow label="Sub Caste" value="Deshastha" />
            <InfoRow label="Education" value="B.Tech, Computer Science" />
            <InfoRow label="Occupation" value="Software Engineer" />
            <InfoRow label="Annual Income" value="4 LPA" />
          </View>
        </View>

        {/* Family */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Father" value="Rajesh Sharma , Businessman" />
            <InfoRow label="Mother" value="Sunita Sharma , Homemaker" />
            <InfoRow label="Sibling's" value="1 Brother , 0 Sister" />
            <InfoRow label="Family Type" value="Nuclear" />
            <InfoRow label="Family Values" value="Moderate" />
            <InfoRow label="Native Place" value="Mumbai" />
          </View>
        </View>

        {/* Horoscope */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horoscope</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Horoscope Available" value="Yes" />
            <InfoRow label="Manglik" value="No" />
            <InfoRow label="Birth Date" value="10-10-2005" />
            <InfoRow label="Birth Place" value="Rahata" />
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Non Vegetarian" value="Yes" />
            <InfoRow label="Hobbies" value="Travel , Music , Cooking ." />
          </View>
        </View>

        {/* Partner Preference */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Partner Preference</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow label="Age Range" value="24-28 Years" />
            <InfoRow label="Preferred Height" value={`5'6" To 6'2"`} />
            <InfoRow
              label="Preferred Occupation"
              value="Engineer , MBA or Similar"
            />
            <InfoRow label="Preferred Location" value="Mumbai , Pune" />
            <InfoRow
              label="Community Preference"
              value="Brahmin / Open to similar Communities"
            />
            <InfoRow label="Marital Status" value="Never Married" />
          </View>
        </View>

        {/* Additional Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Additional Photoes</Text>
            <View style={styles.photoCounter}>
              <Text style={styles.photoCounterText}>0/5</Text>
            </View>
          </View>
          <Text style={styles.photoSubtitle}>
            Add up to 5 Photoes to showcase yourself better
          </Text>
          <View style={styles.photoGrid}>
            <TouchableOpacity style={styles.addPhotoBox}>
              <Ionicons name="add" size={32} color={Colors.maroon} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.emptyPhotoBox}>
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
