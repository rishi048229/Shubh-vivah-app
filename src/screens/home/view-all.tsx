import TodaysMatchCard from "@/components/Home/TodaysMatchCard";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_GAP = 15;
const FILTER_ICON_SIZE = 48; // Size of the filter button container

// Mock Data for View All Grid
const ALL_MATCHES = [
  {
    id: "1",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/66.jpg",
  },
  {
    id: "3",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/67.jpg",
  },
  {
    id: "4",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "5",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/69.jpg",
  },
  {
    id: "6",
    name: "Sejal Sharma",
    age: "25",
    location: "Indore- 3km",
    job: "BSC",
    matchPercentage: "92%",
    tags: ["BSC", "Non Manglik"],
    img: "https://randomuser.me/api/portraits/women/70.jpg",
  },
];

export default function ViewAllScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: (typeof ALL_MATCHES)[0] }) => (
    <TodaysMatchCard
      name={item.name}
      age={item.age}
      location={item.location}
      matchPercentage={item.matchPercentage}
      tags={item.tags}
      imageUri={item.img}
      // Force width to fit 2 columns with spacing
      style={{
        width: (width - 40 - CARD_GAP) / 2, // (Screen Width - Padding - Gap) / 2
        marginRight: 0, // Reset default margin
        marginBottom: 15,
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View All</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search by name or location..."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={22} color="#C21807" />
        </TouchableOpacity>
      </View>

      {/* Recent Searches Title (Optional styling based on image 1) */}
      {/* <Text style={styles.sectionTitle}>Recent Searches</Text> */}

      {/* Grid Content */}
      <FlatList
        data={ALL_MATCHES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory background #FFFFF0 or Colors.ivory
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FFD700", // Gold-ish border as per image
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
    // Add shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE4B5", // Light gold border
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 15,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
