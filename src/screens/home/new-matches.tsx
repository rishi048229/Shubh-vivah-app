import NewMatchCard from "@/components/Home/NewMatchCard";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock Data
const NEW_MATCHES = [
  {
    id: "1",
    name: "Anjali Sharma",
    age: "21",
    location: "Mumbai",
    job: "Software Engineer , 4LPA",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Anjali Sharma",
    age: "21",
    location: "Mumbai",
    job: "Software Engineer , 4LPA",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "3",
    name: "Anjali Sharma",
    age: "21",
    location: "Mumbai",
    job: "Software Engineer , 4LPA",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "4",
    name: "Anjali Sharma",
    age: "21",
    location: "Mumbai",
    job: "Software Engineer , 4LPA",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "5",
    name: "Anjali Sharma",
    age: "21",
    location: "Mumbai",
    job: "Software Engineer , 4LPA",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export default function NewMatchesScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: (typeof NEW_MATCHES)[0] }) => (
    <NewMatchCard
      name={item.name}
      age={item.age}
      job={item.job}
      location={item.location}
      imageUri={item.img}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title Button (Static for now, just visual) */}
        <TouchableOpacity style={styles.titleButton}>
          <Text style={styles.titleText}>New Matches</Text>
        </TouchableOpacity>

        {/* Filter Icon */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#C21807" />
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <FlatList
        data={NEW_MATCHES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titleButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C21807", // Red border
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
