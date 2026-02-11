import ContextHero from "@/components/Home/New/ContextHero";
import DiscoveryRow from "@/components/Home/New/DiscoveryRow";
import HomeSearchOverlay from "@/components/Home/New/HomeSearchOverlay";
import InterestedStack from "@/components/Home/New/InterestedStack";
import KundaliCard from "@/components/Home/New/KundaliCard";
import MatchCarousel from "@/components/Home/New/MatchCarousel";
import MatchInsight from "@/components/Home/New/MatchInsight";
import PreferencesSheet from "@/components/Home/New/PreferencesSheet";
import ProfileCompletion from "@/components/Home/New/ProfileCompletion";
import QuickActions from "@/components/Home/New/QuickActions";
import SpotlightCard from "@/components/Home/New/SpotlightCard";
import VisitorsSheet from "@/components/Home/New/VisitorsSheet";
import ServiceCard from "@/components/ServiceCard";
import SideMenu from "@/components/SideMenu";
import SuccessStories from "@/components/SuccessStories";
import { Colors } from "@/constants/Colors";
import { MOCK_MATCHES } from "@/data/mockConnectionsData";
import { MatchProfile } from "@/types/connections";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  // Refs & State
  const preferencesRef = useRef<BottomSheetModal>(null);
  const visitorsRef = useRef<BottomSheetModal>(null);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // Mock Data Selections
  const primaryMatches = MOCK_MATCHES.slice(0, 5);
  const spotlightMatch = MOCK_MATCHES[5];
  const newMatches = MOCK_MATCHES.slice(6, 10);
  const nearbyMatches = MOCK_MATCHES.slice(2, 6); // Just shuffling for demo

  // Handlers
  const handleProfilePress = (profile: MatchProfile) => {
    router.push({ pathname: "/profile/[id]", params: { id: profile.id } });
  };

  const handleSpotlightPress = () => {
    handleProfilePress(spotlightMatch);
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "1": // Search
        setSearchVisible(true);
        break;
      case "2": // Preferences
        preferencesRef.current?.present();
        break;
      case "3": // Nearby
        router.push("/connections/nearby" as any);
        break;
      case "4": // Shortlisted
        router.push("/shortlisted" as any);
        break;
      case "5": // Visitors
        visitorsRef.current?.present();
        break;
      default:
        console.log("Quick Action Pressed:", id);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor={Colors.ivory} />

        {/* Overlays */}
        <SideMenu
          visible={sideMenuVisible}
          onClose={() => setSideMenuVisible(false)}
        />
        <HomeSearchOverlay
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />
        <PreferencesSheet ref={preferencesRef} onDismiss={() => {}} />
        <VisitorsSheet
          ref={visitorsRef}
          onDismiss={() => {}}
          onProfilePress={(id: string) => {
            visitorsRef.current?.dismiss();
            handleProfilePress({ id } as any);
          }}
        />

        {/* 1. Context Header */}
        <ContextHero
          userName="Rahul"
          userAvatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          contextText="6 high-compatibility matches near you"
          location="Pune, India"
          onAvatarPress={() => setSideMenuVisible(true)}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. Quick Action Strip */}
          <QuickActions onActionPress={handleQuickAction} />
          {/* 3. Primary Match Carousel */}
          <MatchCarousel
            matches={primaryMatches}
            onMatchPress={handleProfilePress}
          />
          {/* 4. Match Insight Explanation */}
          <MatchInsight
            insights={[
              "Matches based on your age preference (24-29)",
              "Highly compatible lifestyle & education",
              "Recently active in Pune",
            ]}
          />
          {/* 5. Today's Spotlight */}
          <SpotlightCard
            profile={spotlightMatch}
            onPress={handleSpotlightPress}
          />
          {/* New Section: Kundali Card */}
          <KundaliCard />
          {/* 6. Secondary Discovery Rows */}
          <DiscoveryRow
            title="New Profiles"
            profiles={newMatches}
            onProfilePress={handleProfilePress}
            onSeeAllPress={() => router.push("/connections")}
          />
          <DiscoveryRow
            title="Near You"
            profiles={nearbyMatches}
            onProfilePress={handleProfilePress}
            onSeeAllPress={() => router.push("/connections")}
          />
          {/* 7. People Interested in You */}
          <TouchableOpacity onPress={() => visitorsRef.current?.present()}>
            <InterestedStack
              count={3}
              avatars={[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
              ]}
              label="people recently showed interest"
            />
          </TouchableOpacity>

          {/* Services Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
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
          {/* Success Stories Carousel */}
          <SuccessStories />
          {/* 8. Profile Completion */}
          <ProfileCompletion
            percentage={70}
            missingFields={["Horoscope", "Bio"]}
          />
          {/* Bottom Spacer for Tab Bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory, // Ivory Background as requested
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ivory, // Ivory Background
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D1406",
  },
});
