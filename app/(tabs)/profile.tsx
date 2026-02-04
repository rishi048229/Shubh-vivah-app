import { ProfileCompletionCTA } from "@/components/profile/ProfileCompletionCTA";
import { ProfileFormModal } from "@/components/profile/ProfileFormModal";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [completion, setCompletion] = useState(72); // Mock completion
  const [openSection, setOpenSection] = useState<string | null>("basic"); // Default open basic

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
        {/* Profile Hero - Keep as simplified header */}
        <ProfileHero
          name={MOCK_USER.name}
          location={MOCK_USER.location}
          image={MOCK_USER.image}
          completionPercentage={completion}
          stats={MOCK_USER.stats}
        />

        {/* Completion CTA */}
        <View style={styles.ctaContainer}>
          <ProfileCompletionCTA
            completionPercentage={completion}
            onPress={() => router.push("/complete-profile/terms-conditions")}
          />
        </View>

        {/* Accordion Sections */}
        <View style={styles.sectionsWrapper}>
          <ProfileSection
            title="Basic Info"
            isExpanded={openSection === "basic"}
            onToggle={() =>
              setOpenSection(openSection === "basic" ? null : "basic")
            }
            onEdit={() => console.log("Edit Basic")}
          >
            <Text style={styles.dataLabel}>Height: 5'10"</Text>
            <Text style={styles.dataLabel}>Weight: 70kg</Text>
            <Text style={styles.dataLabel}>Marital Status: Never Married</Text>
          </ProfileSection>

          <ProfileSection
            title="Career & Education"
            isExpanded={openSection === "career"}
            onToggle={() =>
              setOpenSection(openSection === "career" ? null : "career")
            }
            onEdit={() => console.log("Edit Career")}
          >
            <Text style={styles.dataLabel}>Education: B.Tech CS</Text>
            <Text style={styles.dataLabel}>Profession: Software Engineer</Text>
          </ProfileSection>

          <ProfileSection
            title="Family Details"
            isExpanded={openSection === "family"}
            onToggle={() =>
              setOpenSection(openSection === "family" ? null : "family")
            }
            onEdit={() => console.log("Edit Family")}
          >
            <Text style={styles.dataLabel}>Father: Businessman</Text>
            <Text style={styles.dataLabel}>Mother: Homemaker</Text>
          </ProfileSection>

          <ProfileSection
            title="Lifestyle & Interests"
            isExpanded={openSection === "lifestyle"}
            onToggle={() =>
              setOpenSection(openSection === "lifestyle" ? null : "lifestyle")
            }
            onEdit={() => console.log("Edit Lifestyle")}
          >
            <Text style={styles.dataLabel}>Diet: Vegetarian</Text>
            <Text style={styles.dataLabel}>Drink: No</Text>
          </ProfileSection>

          <ProfileSection
            title="Partner Preferences"
            isExpanded={openSection === "partner"}
            onToggle={() =>
              setOpenSection(openSection === "partner" ? null : "partner")
            }
            onEdit={() => console.log("Edit Partner")}
          >
            <Text style={styles.dataLabel}>Age: 24-29</Text>
            <Text style={styles.dataLabel}>Height: 5'0" - 5'6"</Text>
          </ProfileSection>
        </View>

        <View style={styles.spacer} />
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
  ctaContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionsWrapper: {
    paddingHorizontal: 20,
  },
  dataLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  spacer: {
    height: 40,
  },
});
