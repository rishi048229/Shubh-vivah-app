import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { AINextStepCard } from "@/components/dashboard/AINextStepCard";
import { BestMatchCard } from "@/components/dashboard/BestMatchCard";
import { FreeKundaliCard } from "@/components/dashboard/FreeKundaliCard";
import { MatchFeed } from "@/components/dashboard/MatchFeed";
import { ProfileCompletionHero } from "@/components/dashboard/ProfileCompletionHero";
import { ProfileHealthWidget } from "@/components/dashboard/ProfileHealthWidget";
import { ShortlistStrip } from "@/components/dashboard/ShortlistStrip";
import { PreviousEvents } from "@/components/PreviousEvents";
import { SideDrawer } from "@/components/SideDrawer";
import { TopNavBar } from "@/components/TopNavBar";
import { WeddingJourneyServices } from "@/components/WeddingJourneyServices";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function DashboardScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background Pattern or Gradient could go here */}
      <View style={styles.background} />

      <TopNavBar
        onMenuPress={toggleMenu}
        onProfilePress={() => console.log("Profile Pressed")}
      />

      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCompletionHero />
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
});
