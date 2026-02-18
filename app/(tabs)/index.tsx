import ActionCenterSection from "@/components/Home/New/ActionCenterSection";
import BestMatchesCarousel from "@/components/Home/New/BestMatchesCarousel";
import CollapsibleHero from "@/components/Home/New/CollapsibleHero";
import DiscoveryRow from "@/components/Home/New/DiscoveryRow";
import HomeSearchOverlay from "@/components/Home/New/HomeSearchOverlay";
import InteractionsSheet, {
    InteractionsSheetRef,
} from "@/components/Home/New/InteractionsSheet";
import KundaliCard from "@/components/Home/New/KundaliCard";
import NearbyRadarSection from "@/components/Home/New/NearbyRadarSection";
import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import ProfileCompletion from "@/components/Home/New/ProfileCompletion";
import ShortlistedSheet from "@/components/Home/New/ShortlistedSheet";
import ServiceCard from "@/components/Home/ServiceCard";
import LocationPermissionModal from "@/components/Location/LocationPermissionModal";
import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import * as matchService from "@/services/matchService";
import { MatchProfile } from "@/types/connections";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import SideMenu from "../../components/SideMenu"; // Force refresh

export default function HomeScreen() {
  const router = useRouter();

  // Refs & State
  const preferencesRef = useRef<BottomSheetModal>(null);
  const interactionsRef = useRef<InteractionsSheetRef>(null);
  const shortlistedRef = useRef<BottomSheetModal>(null);
  const searchSheetRef = useRef<BottomSheetModal>(null);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const hasAutoPromptedLocation = useRef(false);

  // ... (Data State and Animation Refs remain exact same as original)

  // Data State
  const [allMatches, setAllMatches] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation Refs
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Fetch real matches & user profile on mount
  useEffect(() => {
    loadMatches();
    loadUserProfile();
  }, []);

  const [userName, setUserName] = useState("User");
  const [userImage, setUserImage] = useState(
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  );
  const [userLocation, setUserLocation] = useState("Pune"); // Default fallback

  const loadUserProfile = async () => {
    try {
      const profile = await import("@/services/profileService").then((m) =>
        m.getProfile(),
      );
      if (profile && profile.fullName) {
        setUserName(profile.fullName.split(" ")[0]); // First name
      }
      if (profile && profile.profilePhotoUrl) {
        setUserImage(profile.profilePhotoUrl);
      }
      // Check for location
      if (profile && profile.city) {
        setUserLocation(profile.city);
      } else if (profile && !profile.city && !hasAutoPromptedLocation.current) {
        hasAutoPromptedLocation.current = true;
        // slight delay
        setTimeout(() => setLocationModalVisible(true), 1500);
      }
    } catch (e) {
      console.log("Error loading user profile", e);
    }
  };

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const profiles: MatchProfile[] = [];
      // Fetch up to 10 profiles
      for (let i = 0; i < 10; i++) {
        const p = await matchService.exploreNext();
        if (!p) break;

        // Map backend DTO to frontend MatchProfile
        profiles.push({
          id: String(p.userId),
          name: p.fullName,
          age: p.age,
          location: p.distanceText ? `${p.city}, ${p.distanceText}` : p.city,
          city: p.city,
          state: "", // Not in DTO
          distance: p.distanceKm || 0,
          matchPercentage: p.matchScore,
          matchReasons: p.religion ? [p.religion] : [],
          imageUri:
            p.profilePhotoUrl ||
            "https://randomuser.me/api/portraits/women/1.jpg",
          profession: "", // Not in DTO
          education: "", // Not in DTO
          religion: p.religion || "",
          caste: "", // Not in DTO
          verified: true,
          onlineStatus: "recently_active",
          maritalStatus: "Never Married",
        } as MatchProfile);
      }

      // Fallback to mock data if API returns empty
      setAllMatches(profiles.length > 0 ? profiles : MOCK_MATCHES);
    } catch (error) {
      console.log("Failed to fetch matches:", error);
      setAllMatches(MOCK_MATCHES);
    } finally {
      setIsLoading(false);
    }
  };

  // Slices for different sections
  const primaryMatches = allMatches.slice(0, 5);
  const nearbyMatches = allMatches.slice(5, 10);
  const newMatches = allMatches.slice(3, 8); // Just random slice for new

  // Handlers
  const handleProfilePress = (profile: MatchProfile) => {
    router.push({ pathname: "/profile/[id]", params: { id: profile.id } });
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "daily":
        loadMatches();
        break;
      case "nearby":
        router.push("/nearby" as any);
        break;
      case "shortlisted":
        shortlistedRef.current?.present();
        break;
      case "search":
        searchSheetRef.current?.present();
        break;
      case "preferences":
        preferencesRef.current?.present();
        break;
      case "visitors":
        // Default to views if called specifically (legacy) or just open interactions
        if (interactionsRef.current) {
          interactionsRef.current.setTab("views");
          interactionsRef.current.present();
        }
        break;
      default:
        console.log("Quick Action Pressed:", id);
    }
  };

  const handleActionCenterPress = (action: string) => {
    switch (action) {
      case "likes":
        interactionsRef.current?.setTab("likes");
        interactionsRef.current?.present();
        break;
      case "views":
        interactionsRef.current?.setTab("views");
        interactionsRef.current?.present();
        break;
      case "messages":
        router.push("/chat" as any);
        break;
      case "shortlisted":
        shortlistedRef.current?.present();
        break;
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      {/* Overlays */}
      {/* 1. Collapsible Hero (NEW) */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      >
        <CollapsibleHero
          userName={userName}
          userAvatar={userImage}
          contextText={`${allMatches.length} matches waiting for you`}
          location={userLocation}
          scrollY={scrollY}
          onAvatarPress={() => setSideMenuVisible(true)}
          onNotificationPress={() => router.push("/notifications" as any)}
          onPrimaryAction={() => {
            // Scroll to matches or whatever primary action is
            console.log("Primary Action");
          }}
          onSecondaryAction={() => preferencesRef.current?.present()}
          onLocationPress={() => setLocationModalVisible(true)}
        />
      </View>

      {/* Overlays */}
      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
      <LocationPermissionModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onLocationDetected={(city: string) => {
          console.log("Location detected:", city);
          // Reload profile to verify persistence and update UI
          loadUserProfile();
          loadMatches();
        }}
      />
      <HomeSearchOverlay
        ref={searchSheetRef}
        onSearch={(query) => console.log("Search query:", query)}
      />
      <PreferencesSheet
        ref={preferencesRef}
        onDismiss={() => {}}
        onApply={(filters) => {
          console.log("Applying filters:", filters);
          loadMatches(); // Reload matches with new filters (mock)
        }}
      />
      <InteractionsSheet
        ref={interactionsRef}
        onDismiss={() => {}}
        onProfilePress={(id: string) => {
          interactionsRef.current?.dismiss();
          handleProfilePress({ id } as any);
        }}
      />
      <ShortlistedSheet
        ref={shortlistedRef}
        onDismiss={() => {}}
        onProfilePress={(id: string) => {
          shortlistedRef.current?.dismiss();
          handleProfilePress({ id } as any);
        }}
      />

      {isLoading ? (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center", marginTop: 50 },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.maroon} />
          <Text style={{ marginTop: 10, color: Colors.maroon }}>
            Finding best matches...
          </Text>
        </MotiView>
      ) : (
        <Animated.ScrollView
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, { paddingTop: 340 }]} // Matches expanded height + gap
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 100 }}
          >
            {/* Section Header: Today's Best Matches */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Best Matches</Text>
            </View>

            {/* 3. Primary Best Matches Carousel (NEW) */}
            <BestMatchesCarousel
              matches={primaryMatches}
              onMatchPress={handleProfilePress}
            />

            {/* 3b. Action Center (NEW) */}
            <ActionCenterSection onPress={handleActionCenterPress} />

            {/* 4. Discover Around You (NEW - Radar) */}
            <NearbyRadarSection
              profiles={nearbyMatches}
              onExplorePress={() => router.push("/nearby" as any)}
              userLocation={userLocation}
            />

            {/* Kundali Card */}
            <KundaliCard />

            {/* Secondary Discovery Rows - New Profiles */}
            <DiscoveryRow
              title="Newly Joined"
              profiles={newMatches}
              onProfilePress={handleProfilePress}
              onSeeAllPress={() => router.push("/connections")}
            />

            {/* Services Section (Restored) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Services</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <ServiceCard
                title="Event Management"
                description="Our app has helped create hundreds of meaningful and successful marriages."
                imageUri="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="1"
                variant="cream"
                onPress={() => router.push("/service")}
              />
              <ServiceCard
                title="Wedding Invite"
                description="We warmly invite you to join us in celebrating a special union made possible."
                imageUri="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="2"
                variant="red"
                onPress={() => router.push("/service")}
              />
              <ServiceCard
                title="Wedding Venues"
                description="Find the perfect wedding venue to celebrate your big day, where beautiful spaces and thoughtful details come together."
                imageUri="https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="3"
                variant="cream"
                onPress={() => router.push("/service")}
              />
              <ServiceCard
                title="Catering Services"
                description="Exquisite catering options to delight your guests with authentic flavors and memorable dining experiences."
                imageUri="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="4"
                variant="red"
                onPress={() => router.push("/service")}
              />
              <ServiceCard
                title="Photography"
                description="Capture every precious moment with our professional photography services that tell your unique love story."
                imageUri="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="5"
                variant="cream"
                onPress={() => router.push("/service")}
              />
              <ServiceCard
                title="Decoration"
                description="Transform your special day with stunning decorations that bring your wedding vision to life."
                imageUri="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                number="6"
                variant="red"
                onPress={() => router.push("/service")}
              />
            </View>

            {/* Profile Completion */}
            <ProfileCompletion
              percentage={70}
              missingFields={["Horoscope", "Bio"]}
            />

            {/* Bottom Spacer for Tab Bar */}
            <View style={{ height: 100 }} />
          </MotiView>
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFF0",
    paddingTop: 0, // GradientHero handles insets
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory Background
  },
  contentContainer: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 5,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1406",
  },
});
