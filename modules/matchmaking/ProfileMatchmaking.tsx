import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AboutMeSection } from "./components/AboutMeSection";
import { PhotoGallery } from "./components/PhotoGallery";
import { ProfileCompletionCTA } from "./components/ProfileCompletionCTA";
import { ProfileHero } from "./components/ProfileHero";
import { SettingsSection } from "./components/SettingsSection";

export default function ProfileScreen() {
  const router = useRouter();
  const [completion, setCompletion] = useState(72); // Mock completion

  const MOCK_USER = {
    name: "Rishi Patel",
    location: "Mumbai, India",
    image: "https://i.pravatar.cc/300?img=11",
    stats: {
      shortlisted: 12,
      views: 450,
      messages: 8,
    },
    images: [
      "https://i.pravatar.cc/300?img=11",
      "https://i.pravatar.cc/300?img=12",
      "https://i.pravatar.cc/300?img=13",
      "https://i.pravatar.cc/300?img=14",
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHero
          name={MOCK_USER.name}
          location={MOCK_USER.location}
          image={MOCK_USER.image}
          completionPercentage={completion}
          stats={MOCK_USER.stats}
        />

        <View style={styles.content}>
          <ProfileCompletionCTA
            completionPercentage={completion}
            onPress={() => router.push("/complete-profile/terms-conditions")}
          />

          <View style={styles.spacer} />

          <PhotoGallery
            images={MOCK_USER.images}
            onAddPhoto={() => console.log("Add photo")}
          />

          <AboutMeSection completionPercentage={completion} />

          <SettingsSection />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});
