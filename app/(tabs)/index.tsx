import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { AINextStepCard } from "@/components/dashboard/AINextStepCard";
import { BestMatchCard } from "@/components/dashboard/BestMatchCard";
import { FreeKundaliCard } from "@/components/dashboard/FreeKundaliCard";
import { MatchFeed } from "@/components/dashboard/MatchFeed";
import { ProfileHealthWidget } from "@/components/dashboard/ProfileHealthWidget";
import { ShortlistStrip } from "@/components/dashboard/ShortlistStrip";
import { PreviousEvents } from "@/components/PreviousEvents";
import { WeddingJourneyServices } from "@/components/WeddingJourneyServices";
// Logic: User said "slider will be the same just if the user will slide down he will come to other things"
// ImmersiveHero is full screen. We will put TopNavBar *inside* ImmersiveHero or just omit it if ImmersiveHero replaces it.
// Given the design, ImmersiveHero has its own header usually. But let's stick to the flow.
// We will put the widgets below the Hero.

// ImmersiveHero removed
import { SideDrawer } from "@/components/SideDrawer"; // Need these too
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Side Drawer Logic (Preserved) */}
      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* HERO SECTION: Full Screen Slider */}
        {/* We can overlay TopNavBar here if valid, or just let Hero be Hero.
            The user shared an image which works as a header. 
            So we just render ImmersiveHero.
        */}
        {/* HEADER & HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Header Overlay */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.profileHeader} onPress={toggleMenu}>
              <Image
                source={require("@/assets/images/irina_dhruv.jpg")}
                style={styles.avatarImage}
              />
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.greetingText}>Good Morning</Text>
                <Text style={styles.userNameText}>Hello, Rishi</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bellButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>12</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Emotional Hero Card */}
          <View style={styles.heroCard}>
            <Image
              // Using a wedding/couple image for emotional appeal.
              // Reusing an existing one or a placeholder url if needed.
              source={require("@/assets/images/pre_wedding.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Find Your Forever</Text>
              <Text style={styles.heroSubtitle}>
                Matches curated with culture & trust
              </Text>
              <View style={styles.heroIcons}>
                <Ionicons
                  name="heart"
                  size={20}
                  color="#FFF"
                  style={{ marginHorizontal: 5 }}
                />
                <Ionicons
                  name="star"
                  size={20}
                  color="#FFF"
                  style={{ marginHorizontal: 5 }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* RESTORED BOTTOM CONTENT */}
        <View style={styles.dashboardContent}>
          {/* We might want the TopNavBar here? Or maybe the user implies the Hero replaces it. 
                 The "Previous" code had TopNavBar at absolute top. 
                 If we put it above ScrollView, it covers Hero? 
                 Let's put the widgets here.
             */}

          <ActivitySummary />
          <BestMatchCard />
          <MatchFeed />
          <ShortlistStrip />
          <FreeKundaliCard />
          <WeddingJourneyServices />
          <ProfileHealthWidget />
          <AINextStepCard />
          <PreviousEvents />
        </View>

        {/* Padding for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory, // Restore background color
  },
  scrollContent: {
    paddingBottom: 0,
  },
  dashboardContent: {
    paddingBottom: 20,
    backgroundColor: Colors.light.ivory,
  },
  heroSection: {
    paddingTop: 60, // Safe area
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.light.maroon,
  },
  welcomeTextContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 12,
    color: "#666",
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  heroCard: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 5,
  },
  heroSubtitle: {
    color: "#EEE",
    fontSize: 14,
    marginBottom: 10,
  },
  heroIcons: {
    flexDirection: "row",
    marginTop: 5,
  },
});
