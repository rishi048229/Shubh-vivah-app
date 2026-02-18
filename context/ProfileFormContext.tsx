import * as profileService from "@/services/profileService";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ProfileFormData {
  // Basic Details
  fullName: string;
  gender: string;
  dateOfBirth: string;
  height: number | null;
  weight: number | null;
  city: string;
  email: string;
  phone: string;
  profileCreatedBy: string; // New field

  // Family Details (moved some here or kept in basic, but for form data grouping)
  fatherName: string; // New field
  motherName: string; // New field

  // Religious Details
  religion: string;
  community: string;
  caste: string;
  manglikStatus: string;
  gothra: string;
  nakshatra: string;
  rashi: string;

  // Education & Career
  highestEducation: string;
  employmentType: string;
  occupation: string;
  annualIncome: number | null;

  // Family Details
  fatherOccupation: string;
  motherOccupation: string;
  brothers: number | null;
  marriedBrothers: number | null;
  sisters: number | null;
  marriedSisters: number | null;
  familyType: string;
  familyStatus: string;
  familyValues: string;

  // Lifestyle
  eatingHabits: string;
  dietPreference: string;
  drinking: boolean | null;
  smoking: boolean | null;
  healthNotes: string;
  aboutMe: string;
}

const defaultFormData: ProfileFormData = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  height: null,
  weight: null,
  city: "",
  email: "",
  phone: "",
  profileCreatedBy: "",
  fatherName: "",
  motherName: "",
  religion: "",
  community: "",
  caste: "",
  manglikStatus: "",
  gothra: "",
  nakshatra: "",
  rashi: "",
  highestEducation: "",
  employmentType: "",
  occupation: "",
  annualIncome: null,
  fatherOccupation: "",
  motherOccupation: "",
  brothers: null,
  marriedBrothers: null,
  sisters: null,
  marriedSisters: null,
  familyType: "",
  familyStatus: "",
  familyValues: "",
  eatingHabits: "",
  dietPreference: "",
  drinking: null,
  smoking: null,
  healthNotes: "",
  aboutMe: "",
};

interface ProfileFormContextType {
  formData: ProfileFormData;
  isLoading: boolean;
  updateFormData: (updates: Partial<ProfileFormData>) => void;
  resetFormData: () => void;
}

const ProfileFormContext = createContext<ProfileFormContextType>({
  formData: defaultFormData,
  isLoading: true,
  updateFormData: () => {},
  resetFormData: () => {},
});

export function useProfileForm() {
  return useContext(ProfileFormContext);
}

export function ProfileFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<ProfileFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing profile on mount to ensure persistence
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      if (data) {
        // Map API data to Form Data
        setFormData(
          (prev) =>
            ({
              ...prev,
              ...data,
              // Ensure nulls are handled if API returns undefined
              height: data.height ?? null,
              weight: data.weight ?? null,
              annualIncome: data.annualIncome ?? null,
              brothers: data.brothers ?? null,
              sisters: data.sisters ?? null,
            }) as any,
        );
      }
    } catch (error) {
      console.log(
        "ProfileFormContext: Failed to load existing profile (might be new user)",
        error,
      );
      // Optional: Don't show alert here to avoid spamming new users
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: Partial<ProfileFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
    // Optionally reload from server to reset to saved state?
    // For now, reset to empty for fresh start
  };

  return (
    <ProfileFormContext.Provider
      value={{ formData, isLoading, updateFormData, resetFormData }}
    >
      {children}
    </ProfileFormContext.Provider>
  );
}
