import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

export default function ShortlistedScreen() {
  const router = useRouter();
  const shortlistedMatches = MOCK_MATCHES.slice(0, 4); // Fake data

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFF0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shortlisted Profiles</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={shortlistedMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/profile/[id]",
                params: { id: item.id },
              })
            }
          >
            {/* Left Image Section */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{item.matchPercentage}%</Text>
              </View>
            </View>

            {/* Right Content Section */}
            <View style={styles.content}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>
                  {item.name}, {item.age}
                </Text>
                <Ionicons name="heart" size={20} color={Colors.maroon} />
              </View>

              <Text style={styles.profession}>{item.profession}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {item.city}, {item.state}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={14} color="#666" />
                <Text style={styles.infoText}>{item.education}</Text>
              </View>

              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectText}>Connect Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  actionButton: {
    padding: 8,
  },
  listContent: {
    padding: 20,
    gap: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45, // Circle
    borderWidth: 2,
    borderColor: Colors.gold || "#FFD700",
  },
  matchBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  matchText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  profession: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#555",
  },
  connectButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#FFF3E0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  connectText: {
    color: "#E65100", // Deep Orange
    fontSize: 12,
    fontWeight: "600",
  },
});
