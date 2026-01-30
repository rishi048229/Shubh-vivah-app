import { AboutMeSection } from "@/components/profile/AboutMeSection";
import { PhotoGallery } from "@/components/profile/PhotoGallery";
import { ProfileCompletionCTA } from "@/components/profile/ProfileCompletionCTA";
import { ProfileFormModal } from "@/components/profile/ProfileFormModal";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
            onPress={() => setIsFormOpen(true)}
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

      <ProfileFormModal
        visible={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
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
