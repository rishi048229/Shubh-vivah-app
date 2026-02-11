import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

// Dummy data for nearby profiles
const NEARBY_PROFILES = [
  {
    id: "1",
    name: "Anjali Sharma",
    age: "21",
    profession: "Software Engineer",
    salary: "4LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Priya Desai",
    age: "24",
    profession: "Product Designer",
    salary: "5LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "3",
    name: "Neha Gupta",
    age: "22",
    profession: "Data Analyst",
    salary: "4.5LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "4",
    name: "Riya Singh",
    age: "23",
    profession: "Architect",
    salary: "6LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "5",
    name: "Sneha Patel",
    age: "25",
    profession: "Marketing Manager",
    salary: "5.5LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

type ProfileCardProps = {
  name: string;
  age: string;
  profession: string;
  salary: string;
  location: string;
  image: string;
  onViewProfile: () => void;
};

function ProfileCard({
  name,
  age,
  profession,
  salary,
  location,
  image,
  onViewProfile,
}: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.profileImage} />
      <View style={styles.cardContent}>
        <Text style={styles.nameText}>
          {name} , {age}
        </Text>
        <Text style={styles.professionText}>
          {profession} , {salary}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.iconButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart" size={24} color="#C21807" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="star-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={onViewProfile}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function NearbyScreen() {
  const router = useRouter();

  const handleViewProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nearby</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {NEARBY_PROFILES.map((profile) => (
            <ProfileCard
              key={profile.id}
              name={profile.name}
              age={profile.age}
              profession={profile.profession}
              salary={profile.salary}
              location={profile.location}
              image={profile.image}
              onViewProfile={() => handleViewProfile(profile.id)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  professionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  viewProfileButton: {
    backgroundColor: "#C21807",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
