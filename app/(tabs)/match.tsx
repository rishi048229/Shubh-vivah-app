import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import MatchPercentageRing from "@/components/MatchPercentageRing";
import { Colors } from "@/constants/Colors";
import * as matchService from "@/services/matchService";
import { DEFAULT_FILTERS } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Hand, MapPin } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.7; // Increased height for better fill

// Fallback mock data when backend is unavailable
const MOCK_MATCHES = [
  {
    id: "1",
    userId: 1,
    name: "Aisha Verma",
    age: "24",
    location: "Mumbai, 3km away",
    profession: "Architect",
    education: "B.Arch",
    matchPercentage: "95%",
    tags: ["Creative", "Never Married"],
    imageUri:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    userId: 2,
    name: "Siya Malhotra",
    age: "26",
    location: "Pune, 5km away",
    profession: "Financial Analyst",
    education: "MBA Finance",
    matchPercentage: "89%",
    tags: ["Professional", "Never Married"],
    imageUri:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    userId: 3,
    name: "Mira Khan",
    age: "25",
    location: "Delhi, 8km away",
    profession: "Journalist",
    education: "MA Journalism",
    matchPercentage: "91%",
    tags: ["Liberal", "Never Married"],
    imageUri:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    userId: 4,
    name: "Ishita Patel",
    age: "27",
    location: "Ahmedabad, 10km away",
    profession: "Doctor",
    education: "MBBS",
    matchPercentage: "87%",
    tags: ["Veg", "Never Married"],
    imageUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  },
];

type MatchItem = {
  id: string;
  userId: number;
  name: string;
  age: string;
  location: string;
  profession: string;
  education: string;
  matchPercentage: string;
  tags: string[];
  imageUri: string;
};

export default function MatchScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());
  const flatListRef = useRef<FlatList>(null);
  const preferencesRef = useRef<BottomSheetModal>(null);

  const loadMatches = useCallback(async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      // Use searchProfiles to get batch matches with filters
      const results = await matchService.searchProfiles("", {
        minAge: currentFilters.ageRange[0],
        maxAge: currentFilters.ageRange[1],
        city:
          currentFilters.cities[0] === "Any"
            ? undefined
            : currentFilters.cities[0],
        religion:
          currentFilters.religions[0] === "Any"
            ? undefined
            : currentFilters.religions[0],
        community:
          currentFilters.communities[0] === "Any"
            ? undefined
            : currentFilters.communities[0],
        maritalStatus:
          currentFilters.maritalStatus[0] === "Any"
            ? undefined
            : currentFilters.maritalStatus[0],
      });

      const profiles: MatchItem[] = results.map((p, index) => ({
        id: String(p.userId),
        userId: p.userId,
        name: p.fullName,
        age: String(p.age),
        location: p.city || "Unknown",
        profession: p.occupation || "Not Specified",
        education: p.education || "Not Specified",
        matchPercentage: `${p.matchScore}%`,
        tags: [p.religion, p.caste].filter(Boolean) as string[],
        // FORCE OVERWRITE IMAGE with high-quality mocks cyclically
        imageUri: MOCK_MATCHES[index % MOCK_MATCHES.length].imageUri,
      }));

      setMatches(profiles.length > 0 ? profiles : MOCK_MATCHES);
    } catch {
      setMatches(MOCK_MATCHES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleApplyFilters = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadMatches(updatedFilters);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const goToNext = () => {
    if (currentIndex < matches.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleLike = async () => {
    const currentMatch = matches[currentIndex];
    if (!currentMatch) return;
    try {
      // Optimistic NEXT
      goToNext();
      const result = await matchService.likeUser(currentMatch.userId);
      if (result.includes("matched") || result.includes("Match")) {
        Alert.alert(
          "🎉 It's a Match!",
          `You and ${currentMatch.name} liked each other!`,
        );
      }
    } catch (error: any) {
      // Silently ignore
    }
  };

  const handlePass = async () => {
    goToNext();
  };

  const handleStar = async () => {
    const currentMatch = matches[currentIndex];
    if (!currentMatch) return;
    try {
      await matchService.shortlistUser(currentMatch.userId);
      Alert.alert(
        "⭐ Shortlisted",
        `${currentMatch.name} has been shortlisted!`,
      );
    } catch {
      // Silently ignore
    }
  };

  const handleWave = (userId: number) => {
    setLikedProfiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
        Alert.alert("Interaction", "You waved at them! 👋");
      }
      return newSet;
    });
  };

  const renderItem = ({ item }: { item: MatchItem }) => {
    const isWaved = likedProfiles.has(item.userId);

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.card}
          onPress={() => router.push(`/profile/${item.userId}` as any)}
        >
          {/* Full Screen Image */}
          <Image source={{ uri: item.imageUri }} style={styles.image} />

          {/* Gradients for readability */}
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent"]}
            style={styles.topGradient}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.95)"]}
            style={styles.bottomGradient}
          />

          {/* Top Section */}
          <View style={styles.topContainer}>
            <View style={styles.topLeft}>
              <Text style={styles.name}>
                {item.name}, {item.age}
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#E5E7EB" />
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.topRight}>
              <MatchPercentageRing
                percentage={parseInt(item.matchPercentage)}
                size={50}
                strokeWidth={4}
                textSize={12}
              />
            </View>
          </View>

          {/* Bottom Overlay Content */}
          <View style={styles.bottomContainer}>
            <Text style={styles.bioText} numberOfLines={2}>
              Looking for someone who shares my passion for travel and good
              food. Let's connect!
            </Text>

            <View style={styles.tagsRow}>
              {item.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.pillTag}>
                  <Text style={styles.pillText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Floating Wave Button (Bottom Right) */}
          <TouchableOpacity
            style={[
              styles.floatingWaveButton,
              isWaved && styles.floatingWaveButtonActive,
            ]}
            onPress={() => handleWave(item.userId)}
          >
            <Hand
              size={28}
              color={isWaved ? "#2D1406" : "#2D1406"}
              fill={isWaved ? "#2D1406" : "transparent"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
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
          data={matches}
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
            <Ionicons name="close" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonSmall}
            onPress={handleStar}
          >
            <Ionicons name="star" size={24} color={Colors.maroon} />
          </TouchableOpacity>
        </View>
        <PreferencesSheet
          ref={preferencesRef}
          onDismiss={() => {}}
          onApply={handleApplyFilters}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 60,
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
    justifyContent: "center",
    flexGrow: 1,
  },
  cardContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "black",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  topContainer: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  topLeft: {
    flex: 1,
    gap: 4,
  },
  topRight: {
    // Match Ring container
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  location: {
    fontSize: 15,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 80,
    paddingBottom: 20,
    gap: 12,
  },
  bioText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  pillText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  floatingWaveButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FACC15",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FACC15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  floatingWaveButtonActive: {
    backgroundColor: "#FFD700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 30,
    zIndex: 50,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: Colors.ivory,
  },
  actionButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FACC15",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FACC15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
