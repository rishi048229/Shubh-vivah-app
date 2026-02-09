import { useProfile } from "@/context/ProfileContext";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PillInfoCard } from "./PillInfoCard";
import { ProfileEditSheet } from "./ProfileEditSheet";

type EditSection = "basic" | "education" | "family" | "lifestyle" | null;

export const ProfileInfoCards = () => {
  const { profileData } = useProfile();
  const [editSection, setEditSection] = useState<EditSection>(null);

  const basicInfoItems = [
    {
      label: "Age",
      value: profileData.dateOfBirth
        ? calculateAge(profileData.dateOfBirth)
        : null,
    },
    {
      label: "Height",
      value: profileData.height ? `${profileData.height}'` : null,
    },
    { label: "Marital Status", value: "Never Married" },
    { label: "Religion", value: profileData.religion || null },
    { label: "Community", value: profileData.community || null },
  ].filter((item) => item.value !== null && item.value !== "Not set") as any;

  const educationItems = [
    { label: "Education", value: profileData.highestEducation || null },
    { label: "Profession", value: profileData.occupation || null },
    { label: "Company", value: null }, // TODO: Add to ProfileDto
    {
      label: "Income",
      value: profileData.annualIncome
        ? `₹${profileData.annualIncome} LPA`
        : null,
    },
  ].filter((item) => item.value !== null && item.value !== "Not set") as any;

  const familyItems = [
    { label: "Family Type", value: profileData.familyType || null },
    { label: "Father", value: profileData.fatherOccupation || null },
    { label: "Mother", value: profileData.motherOccupation || null },
    {
      label: "Siblings",
      value: formatSiblings(profileData.brothers, profileData.sisters),
    },
  ].filter((item) => item.value !== null && item.value !== "Not set") as any;

  const lifestyleItems = [
    { label: "Diet", value: profileData.eatingHabits || null },
    {
      label: "Drinking",
      value:
        profileData.drinking !== undefined
          ? profileData.drinking
            ? "Yes"
            : "No"
          : null,
    },
    {
      label: "Smoking",
      value:
        profileData.smoking !== undefined
          ? profileData.smoking
            ? "Yes"
            : "No"
          : null,
    },
    { label: "Hobbies", value: null }, // TODO: Add to ProfileDto
  ].filter((item) => item.value !== null) as any;

  return (
    <View style={styles.container}>
      <PillInfoCard
        title="Basic Info"
        titleIcon="person-outline"
        items={basicInfoItems}
        onEdit={() => setEditSection("basic")}
        index={0}
      />
      <PillInfoCard
        title="Education & Career"
        titleIcon="school-outline"
        items={educationItems}
        onEdit={() => setEditSection("education")}
        index={1}
      />
      <PillInfoCard
        title="Family Details"
        titleIcon="people-outline"
        items={familyItems}
        onEdit={() => setEditSection("family")}
        index={2}
      />
      <PillInfoCard
        title="Lifestyle"
        titleIcon="leaf-outline"
        items={lifestyleItems}
        onEdit={() => setEditSection("lifestyle")}
        index={3}
      />

      <ProfileEditSheet
        visible={editSection !== null}
        section={editSection}
        onClose={() => setEditSection(null)}
      />
    </View>
  );
};

// Helper functions
function calculateAge(dob: string): string {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return `${age} years`;
}

function formatSiblings(brothers?: number, sisters?: number): string {
  const parts: string[] = [];
  if (brothers) parts.push(`${brothers} Brother${brothers > 1 ? "s" : ""}`);
  if (sisters) parts.push(`${sisters} Sister${sisters > 1 ? "s" : ""}`);
  return parts.length > 0 ? parts.join(", ") : "Not set";
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
