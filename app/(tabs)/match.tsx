import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
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

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.75;

// Mock match data
const MATCHES = [
  {
    id: "1",
    name: "Anjali Sharma",
    age: "25",
    location: "Mumbai, 3km away",
    profession: "Software Engineer",
    education: "B.Tech in Computer Science",
    matchPercentage: "92%",
    tags: ["Non Manglik", "Never Married"],
    imageUri: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Priya Desai",
    age: "24",
    location: "Mumbai, 5km away",
    profession: "Product Designer",
    education: "MBA",
    matchPercentage: "88%",
    tags: ["Manglik", "Never Married"],
    imageUri: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "3",
    name: "Neha Gupta",
    age: "26",
    location: "Mumbai, 7km away",
    profession: "Data Analyst",
    education: "M.Sc Statistics",
    matchPercentage: "85%",
    tags: ["Non Manglik", "Never Married"],
    imageUri: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "4",
    name: "Riya Singh",
    age: "23",
    location: "Mumbai, 2km away",
    profession: "Architect",
    education: "B.Arch",
    matchPercentage: "90%",
    tags: ["Manglik", "Never Married"],
    imageUri: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "5",
    name: "Kavya Patel",
    age: "27",
    location: "Mumbai, 10km away",
    profession: "Marketing Manager",
    education: "MBA Marketing",
    matchPercentage: "87%",
    tags: ["Non Manglik", "Never Married"],
    imageUri: "https://randomuser.me/api/portraits/women/17.jpg",
  },
];

export default function MatchScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const preferencesRef = useRef<BottomSheetModal>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleLike = () => {
    // console.log("Liked");
    if (currentIndex < MATCHES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handlePass = () => {
    // console.log("Passed");
    if (currentIndex < MATCHES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleEmojiAction = (emoji: string) => {
    Alert.alert("Interaction", `You sent a ${emoji}!`);
  };

  const renderItem = ({ item }: { item: (typeof MATCHES)[0] }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image source={{ uri: item.imageUri }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          />

          {/* Emoji Interactions */}
          <View style={styles.emojiContainer}>
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => handleEmojiAction("Yellow Heart 💛")}
            >
              <Text style={styles.emojiText}>💛</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => handleEmojiAction("Cheers 🍻")}
            >
              <Text style={styles.emojiText}>🍻</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => handleEmojiAction("Race 🏎️")}
            >
              <Text style={styles.emojiText}>🏎️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => handleEmojiAction("Tennis 🎾")}
            >
              <Text style={styles.emojiText}>🎾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{item.matchPercentage} Match</Text>
            </View>

            <Text style={styles.name}>
              {item.name}, {item.age}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="white" />
              <Text style={styles.location}>{item.location}</Text>
            </View>

            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.profession}>{item.profession}</Text>
            <Text style={styles.education}>{item.education}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Recommendations</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => preferencesRef.current?.present()}
          >
            <Ionicons name="options-outline" size={24} color={Colors.maroon} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={MATCHES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionButtonSmall}
            onPress={handlePass}
          >
            <Ionicons name="close" size={30} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={36} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonSmall} onPress={() => {}}>
            <Ionicons name="star" size={30} color={Colors.maroon} />
          </TouchableOpacity>
        </View>
        <PreferencesSheet ref={preferencesRef} onDismiss={() => {}} />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cardContainer: {
    width: width, // Full width for pagination
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  matchBadge: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  matchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  location: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  profession: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  education: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 10,
    width: "100%",
  },
  actionButtonSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionButtonLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF4B4B", // Red for center button (Super Like/Fire)
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 0,
  },
  emojiContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "column",
    gap: 12,
    zIndex: 100, // Ensure on top
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    // backdropFilter removed for RN compatibility
  },
  emojiText: {
    fontSize: 20,
  },
});
