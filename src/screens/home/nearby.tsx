import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

// Dummy data for nearby profiles
const NEARBY_PROFILES = [
  {
    id: "1",
    name: "Kavya Yadav",
    age: "24",
    profession: "Software Engineer",
    salary: "4LPA",
    location: "Chennai",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: true,
  },
  {
    id: "2",
    name: "Myra Reddy",
    age: "21",
    profession: "Product Designer",
    salary: "5LPA",
    location: "Lucknow",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    verified: true,
  },
  {
    id: "3",
    name: "Neha Gupta",
    age: "22",
    profession: "Data Analyst",
    salary: "4.5LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: false,
  },
  {
    id: "4",
    name: "Riya Singh",
    age: "23",
    profession: "Architect",
    salary: "6LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    verified: true,
  },
  {
    id: "5",
    name: "Sneha Patel",
    age: "25",
    profession: "Marketing Manager",
    salary: "5.5LPA",
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    verified: false,
  },
];

type ProfileCardProps = {
  item: (typeof NEARBY_PROFILES)[0];
  onViewProfile: () => void;
};

function ProfileCard({ item, onViewProfile }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.profileImage} />

        {/* Gradient Overlay for text readability if needed, or just style */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.1)"]}
          style={styles.imageGradient}
        />

        {/* Action Icons Overlay */}
        <View style={styles.overlayIcons}>
          <TouchableOpacity style={styles.iconButtonBlur}>
            <Ionicons name="star-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButtonBlur}>
            <Ionicons name="heart-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
          {item.verified && (
            <MaterialIcons name="verified" size={16} color="#3b82f6" />
          )}
        </View>

        <Text style={styles.detailsText}>
          {item.age} • {item.location}
        </Text>

        <Text style={styles.professionText} numberOfLines={1}>
          {/* Display profession or fallback */}
          NOT SPECIFIED
        </Text>

        <TouchableOpacity style={styles.connectButton} onPress={onViewProfile}>
          <Ionicons
            name="person-add-outline"
            size={16}
            color="#FFF"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
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

        {/* Profile Grid */}
        <FlatList
          data={NEARBY_PROFILES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProfileCard
              item={item}
              onViewProfile={() => handleViewProfile(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    backgroundColor: Colors.ivory,
    zIndex: 10,
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
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  /* Card Styles */
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Square image
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayIcons: {
    position: "absolute",
    top: 8,
    right: 8,
    gap: 8,
  },
  iconButtonBlur: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent dark
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardContent: {
    padding: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 4,
  },
  detailsText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  professionText: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  connectButton: {
    flexDirection: "row",
    backgroundColor: "#4a0404", // Maroon
    borderRadius: 20,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  connectButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
