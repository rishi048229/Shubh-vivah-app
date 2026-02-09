import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock shortlisted profiles - in real app, fetch from backend
const SHORTLISTED_PROFILES = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 24,
    city: "Mumbai",
    profession: "Software Engineer",
    image: "https://i.pravatar.cc/300?img=1",
    matchPercentage: 92,
    education: "B.Tech, IIT Mumbai",
  },
  {
    id: "2",
    name: "Ananya Gupta",
    age: 26,
    city: "Delhi",
    profession: "Doctor",
    image: "https://i.pravatar.cc/300?img=5",
    matchPercentage: 88,
    education: "MBBS, AIIMS Delhi",
  },
  {
    id: "3",
    name: "Sneha Patel",
    age: 25,
    city: "Bangalore",
    profession: "Marketing Manager",
    image: "https://i.pravatar.cc/300?img=9",
    matchPercentage: 85,
    education: "MBA, IIM Bangalore",
  },
  {
    id: "4",
    name: "Kavya Reddy",
    age: 23,
    city: "Hyderabad",
    profession: "Data Scientist",
    image: "https://i.pravatar.cc/300?img=16",
    matchPercentage: 90,
    education: "M.Tech, IIIT Hyderabad",
  },
];

interface ShortlistedProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  image: string;
  matchPercentage: number;
  education: string;
}

const ProfileCard = ({
  profile,
  index,
}: {
  profile: ShortlistedProfile;
  index: number;
}) => {
  const router = useRouter();

  const handleMessage = () => {
    console.log("Message:", profile.name);
  };

  const handleLike = () => {
    console.log("Like:", profile.name);
  };

  const handleViewProfile = () => {
    // Navigate to full profile view
    console.log("View profile:", profile.name);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleViewProfile}
        activeOpacity={0.9}
      >
        {/* Left - Profile Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profile.image }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{profile.matchPercentage}%</Text>
          </View>
        </View>

        {/* Right - Info */}
        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={handleViewProfile}>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
          </TouchableOpacity>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={styles.detailText}>{profile.city}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="briefcase-outline" size={14} color="#888" />
            <Text style={styles.detailText}>{profile.profession}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="school-outline" size={14} color="#888" />
            <Text style={styles.detailText} numberOfLines={1}>
              {profile.education}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleMessage}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.light.maroon}
              />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.likeBtn]}
              onPress={handleLike}
            >
              <Ionicons name="heart" size={18} color="#FFF" />
              <Text style={styles.likeBtnText}>Liked</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ShortlistedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.maroon} />
        </TouchableOpacity>
        <Text style={styles.title}>Shortlisted Profiles</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{SHORTLISTED_PROFILES.length}</Text>
        </View>
      </View>

      {/* Profile List */}
      {SHORTLISTED_PROFILES.length > 0 ? (
        <FlatList
          data={SHORTLISTED_PROFILES}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ProfileCard profile={item} index={index} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>No Shortlisted Profiles</Text>
          <Text style={styles.emptyDesc}>
            Profiles you shortlist will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/(tabs)/discover")}
          >
            <Text style={styles.browseBtnText}>Browse Matches</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  countBadge: {
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: Colors.light.gold,
    fontSize: 13,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    marginRight: 14,
  },
  profileImage: {
    width: 90,
    height: 110,
    borderRadius: 12,
  },
  matchBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: Colors.light.gold,
    borderRadius: 8,
    paddingVertical: 2,
    alignItems: "center",
  },
  matchText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.lightMaroon,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.maroon,
    fontWeight: "600",
  },
  likeBtn: {
    backgroundColor: Colors.light.maroon,
  },
  likeBtnText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: Colors.light.maroon,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseBtnText: {
    color: Colors.light.gold,
    fontSize: 14,
    fontWeight: "bold",
  },
});
