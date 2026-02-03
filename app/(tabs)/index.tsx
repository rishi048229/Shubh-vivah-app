import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { AINextStepCard } from "@/components/dashboard/AINextStepCard";
import { BestMatchCard } from "@/components/dashboard/BestMatchCard";
import { FreeKundaliCard } from "@/components/dashboard/FreeKundaliCard";
import { MatchFeed } from "@/components/dashboard/MatchFeed";
import MatchActionBar from "@/components/MatchActionBar";
import { SideDrawer } from "@/components/SideDrawer";
import SwipeDeck, { SwipeDeckRef } from "@/components/SwipeDeck";
import { TopNavBar } from "@/components/TopNavBar";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
// import { ProfileCompletionHero } from "@/components/dashboard/ProfileCompletionHero"; // Replaced by SwipeDeck
import { ProfileHealthWidget } from "@/components/dashboard/ProfileHealthWidget";
import { ShortlistStrip } from "@/components/dashboard/ShortlistStrip";
import { PreviousEvents } from "@/components/PreviousEvents";
import { WeddingJourneyServices } from "@/components/WeddingJourneyServices";

// Dummy Data with Real Images
const MOCK_PROFILES = [
  {
    id: "1",
    name: "Riya Sharma",
    age: 26,
    location: "Mumbai, India",
    image: {
      uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    },
    bio: "Love traveling and exploring new cafes. Looking for someone with a good sense of humor.",
    matchPercentage: 95,
  },
  {
    id: "2",
    name: "Priya Patel",
    age: 24,
    location: "Ahmedabad, Gujarat",
    image: {
      uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
    },
    bio: "Software Engineer by profession. Traditional values with a modern outlook.",
    matchPercentage: 88,
  },
  {
    id: "3",
    name: "Sneha Gupta",
    age: 27,
    location: "Delhi, India",
    image: {
      uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop",
    },
    bio: "Music lover and foodie. Let's connect over coffee!",
    matchPercentage: 92,
  },
];

import { useRouter } from "expo-router"; // Import router

export default function DashboardScreen() {
  const router = useRouter(); // Initialize router
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const swipeDeckRef = useRef<SwipeDeckRef>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRewind = () => {
    swipeDeckRef.current?.rewind();
  };

  const handleNope = () => {
    swipeDeckRef.current?.swipeLeft();
  };

  const handleLike = () => {
    swipeDeckRef.current?.swipeRight();
  };

  const handleSuperLike = () => {
    // Implement super like logic (e.g., swipe up/right with special effect)
    swipeDeckRef.current?.swipeRight();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.background} />

      <TopNavBar
        onMenuPress={toggleMenu}
        onProfilePress={() => router.push("/(tabs)/profile")}
      />

      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Swipe Deck Section (formerly ProfileCompletionHero) */}
        <View style={styles.deckSection}>
          <View style={styles.deckContainer}>
            <SwipeDeck
              ref={swipeDeckRef}
              profiles={MOCK_PROFILES}
              onSwipeLeft={(profile) => console.log("Passed:", profile.name)}
              onSwipeRight={(profile) => console.log("Liked:", profile.name)}
            />
          </View>
          <MatchActionBar
            onRewind={handleRewind}
            onNope={handleNope}
            onLike={handleLike}
            onSuperLike={handleSuperLike}
          />
        </View>

        <ActivitySummary />
        <BestMatchCard />
        <MatchFeed />
        <ShortlistStrip />
        <FreeKundaliCard />

        {/* Wedding Journey Section (Preserved) */}
        <WeddingJourneyServices />

        <ProfileHealthWidget />
        <AINextStepCard />

        {/* Previous Events (Preserved) */}
        <PreviousEvents />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.ivory,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating bottom nav
    paddingTop: 10,
  },
  deckSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  deckContainer: {
    height: 500, // Fixed height for the deck to fit in ScrollView
    width: "100%",
    marginBottom: 10,
    zIndex: 100, // Ensure cards swipe above other content if they overlap
  },
});
