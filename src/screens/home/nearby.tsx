import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
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
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

import { getNearbyMatches } from "@/services/matchService";
import { MatchProfile } from "@/types/connections";

// --- Empty State Component ---
function EmptyState() {
  const router = useRouter();
  return (
    <View style={emptyStyles.container}>
      <Ionicons name="location-outline" size={60} color={Colors.maroon} />
      <Text style={emptyStyles.title}>No Matches Nearby</Text>
      <Text style={emptyStyles.subtitle}>
        We couldn't currently find any compatible profiles in your immediate area. Adjust your preferences or complete your profile to improve matches!
      </Text>
      <TouchableOpacity style={emptyStyles.ctaButton} onPress={() => router.push("/complete-profile" as any)}>
        <Text style={emptyStyles.ctaText}>Complete Your Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1406",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

// --- Radar Map Component ---
function MapRadar() {
  const pulse1 = useSharedValue(0.6);
  const pulse2 = useSharedValue(0.4);
  const pulse3 = useSharedValue(0.2);
  const dotScale = useSharedValue(1);

  useEffect(() => {
    // Expanding pulse rings
    pulse1.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
    );
    pulse2.value = withRepeat(
      withSequence(
        withDelay(
          600,
          withTiming(1.6, { duration: 2000, easing: Easing.out(Easing.ease) }),
        ),
        withTiming(0.4, { duration: 0 }),
      ),
      -1,
    );
    pulse3.value = withRepeat(
      withSequence(
        withDelay(
          1200,
          withTiming(1.4, { duration: 2000, easing: Easing.out(Easing.ease) }),
        ),
        withTiming(0.2, { duration: 0 }),
      ),
      -1,
    );

    // Center dot blinking
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
    );
  }, []);

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1.value }],
    opacity: 2 - pulse1.value,
  }));
  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2.value }],
    opacity: 1.8 - pulse2.value,
  }));
  const pulseStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse3.value }],
    opacity: 1.5 - pulse3.value,
  }));
  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  // Generate blinking profile dots around the radar
  const blipPositions = [
    { x: -60, y: -40 },
    { x: 50, y: -55 },
    { x: -75, y: 30 },
    { x: 65, y: 45 },
    { x: -20, y: 65 },
    { x: 40, y: -10 },
    { x: -50, y: -70 },
    { x: 80, y: 15 },
  ];

  return (
    <View style={mapStyles.container}>
      <LinearGradient
        colors={["#1A0A0A", "#2D0F0F", "#1A0808"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid lines */}
      <View style={mapStyles.gridH1} />
      <View style={mapStyles.gridH2} />
      <View style={mapStyles.gridV1} />
      <View style={mapStyles.gridV2} />

      {/* Radar rings */}
      <View style={mapStyles.ring1} />
      <View style={mapStyles.ring2} />
      <View style={mapStyles.ring3} />

      {/* Pulse effects */}
      <Animated.View style={[mapStyles.pulse, pulseStyle1]} />
      <Animated.View style={[mapStyles.pulse, pulseStyle2]} />
      <Animated.View style={[mapStyles.pulse, pulseStyle3]} />

      {/* Profile blips */}
      {blipPositions.map((pos, i) => (
        <BlinkingDot key={i} x={pos.x} y={pos.y} delay={i * 400} index={i} />
      ))}

      {/* Center marker */}
      <Animated.View style={[mapStyles.centerDot, dotStyle]}>
        <Ionicons name="navigate" size={18} color="#FFF" />
      </Animated.View>

      {/* Label */}
      <View style={mapStyles.labelContainer}>
        <Ionicons name="location" size={14} color="#FF6B6B" />
        <Text style={mapStyles.labelText}>People Around You</Text>
      </View>
    </View>
  );
}

// --- Blinking Dot Component ---
function BlinkingDot({ x, y, delay, index }: { x: number; y: number; delay: number; index: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 }),
        ),
        -1,
      ),
    );
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6B6B", "#C084FC", "#F472B6", "#34D399"];

  return (
    <Animated.View
      style={[
        mapStyles.blip,
        {
          marginLeft: x,
          marginTop: y,
        },
        style,
      ]}
    >
      <View style={[mapStyles.blipInner, { backgroundColor: colors[index % colors.length] }]} />
    </Animated.View>
  );
}

// --- Profile Card ---
type ProfileGroup = {
  state: string;
  profiles: MatchProfile[];
};

function NearbyProfileCard({
  item,
  index,
  onPress,
}: {
  item: MatchProfile;
  index: number;
  onPress: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(400)
        .springify()
        .damping(15)}
    >
      <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: item.imageUri }} style={cardStyles.image} />

        {/* Gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={cardStyles.gradient}
        />

        {/* Verified badge */}
        {item.verified && (
          <View style={cardStyles.verifiedBadge}>
            <MaterialIcons name="verified" size={14} color="#3B82F6" />
          </View>
        )}

        {/* Info overlay */}
        <View style={cardStyles.infoOverlay}>
          <Text style={cardStyles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={cardStyles.detail}>
            {item.age} • {item.location}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={cardStyles.actions}>
          <TouchableOpacity style={cardStyles.actionBtn}>
            <Ionicons name="heart-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// --- Main Screen ---
export default function NearbyScreen() {
  const router = useRouter();
  const [groupedProfiles, setGroupedProfiles] = React.useState<ProfileGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetchNearby();
  }, []);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const data = await getNearbyMatches();
      // Group by city dynamically
      const groups: Record<string, MatchProfile[]> = {};
      data.forEach((p: any) => {
        // Just mocking backend DTO to MatchProfile properties here
        const locationStr = p.city || "Unknown";
        if (!groups[locationStr]) groups[locationStr] = [];
        
        // MatchProfile wrapper mapping
        groups[locationStr].push({
          id: String(p.userId),
          name: p.fullName,
          age: p.age,
          location: locationStr,
          city: locationStr,
          state: "Unknown", // Can be removed if not needed 
          distance: p.distanceKm || 0,
          matchPercentage: p.matchScore || 0,
          matchReasons: [],
          imageUri: p.profilePhotoUrl || "https://randomuser.me/api/portraits/women/1.jpg",
          profession: p.occupation || "",
          education: p.education || "",
          religion: p.religion || "",
          caste: p.caste || "",
          verified: true,
          onlineStatus: "recently_active",
          maritalStatus: "Never Married",
        });
      });

      const formatted = Object.keys(groups).map((key) => ({
        state: key,
        profiles: groups[key].slice(0, 10), // Take max 10 per group
      }));
      setGroupedProfiles(formatted);
    } catch (e) {
      console.log("Error fetching nearby matches:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Floating Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Map/Radar Section */}
        <MapRadar />

        {/* Content */}
        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <Text style={styles.mainTitle}>People Near You</Text>
            <Text style={styles.mainSubtitle}>
              Discover matches across different states and regions
            </Text>
          </Animated.View>

          {/* State Sections */}
          {loading ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>Locating matches near you...</Text>
            </View>
          ) : groupedProfiles.length === 0 ? (
            <EmptyState />
          ) : (
            groupedProfiles.map((stateData, stateIndex) => (
              <Animated.View
                key={stateData.state}
                entering={FadeInDown.delay(300 + stateIndex * 150)
                  .duration(400)
                  .springify()}
              >
                <View style={styles.stateHeader}>
                  <View style={styles.stateLeft}>
                    <Ionicons name="location-sharp" size={16} color={Colors.maroon} />
                    <Text style={styles.stateName}>{stateData.state}</Text>
                  </View>
                  <Text style={styles.profileCount}>
                    {stateData.profiles.length} profiles
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {stateData.profiles.map((profile, pIndex) => (
                    <NearbyProfileCard
                      key={profile.id}
                      item={profile}
                      index={pIndex}
                      onPress={() => handleViewProfile(profile.id)}
                    />
                  ))}
                </ScrollView>
              </Animated.View>
            ))
          )}

          {/* Bottom spacer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0505",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 56,
    left: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: "#FFFFF0",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    minHeight: 600,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2D1406",
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#8B7355",
    marginBottom: 24,
  },
  stateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  stateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stateName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D1406",
  },
  profileCount: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  horizontalList: {
    gap: 12,
    paddingBottom: 20,
    paddingRight: 20,
  },
});

const mapStyles = StyleSheet.create({
  container: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  gridH1: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(128,0,0,0.08)",
  },
  gridH2: {
    position: "absolute",
    top: "65%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(128,0,0,0.08)",
  },
  gridV1: {
    position: "absolute",
    left: "35%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(128,0,0,0.08)",
  },
  gridV2: {
    position: "absolute",
    left: "65%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(128,0,0,0.08)",
  },
  ring1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(200,50,50,0.15)",
  },
  ring2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(200,50,50,0.1)",
  },
  ring3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: "rgba(200,50,50,0.06)",
  },
  pulse: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(180,30,30,0.12)",
  },
  centerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroon,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  blip: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  blipInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  labelContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.2)",
  },
  labelText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
  },
});

const CARD_WIDTH = 160;

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#2D1406",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  verifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 3,
  },
  infoOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  detail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  actions: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
