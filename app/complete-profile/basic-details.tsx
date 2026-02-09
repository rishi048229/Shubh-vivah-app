import {
    CustomDatePicker,
    CustomModalDropdown,
    CustomTextInput,
} from "@/components/complete-profile/FormControls";
import ProfileLayout from "@/components/complete-profile/ProfileLayout";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

const HEIGHT_OPTIONS = [
  "4'5\"",
  "4'6\"",
  "4'7\"",
  "4'8\"",
  "4'9\"",
  "4'10\"",
  "4'11\"",
  "5'0\"",
  "5'1\"",
  "5'2\"",
  "5'3\"",
  "5'4\"",
  "5'5\"",
  "5'6\"",
  "5'7\"",
  "5'8\"",
  "5'9\"",
  "5'10\"",
  "5'11\"",
  "6'0\"",
  "6'1\"",
  "6'2\"",
  "6'3\"",
  "6'4\"",
  "6'5\"",
];

const WEIGHT_OPTIONS = Array.from({ length: 61 }, (_, i) => `${40 + i} kg`);

const CITY_OPTIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Other",
];

import { useProfile } from "@/context/ProfileContext";
import { profileService } from "@/services/profileService";
import { useLocalSearchParams } from "expo-router";
const BasicDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialGender = typeof params.gender === "string" ? params.gender : "";

  const { profileData, updateProfileData } = useProfile();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: initialGender,
    dob: "", // Will store as YYYY-MM-DD
    height: "",
    weight: "",
    city: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // City Data Mapping
  const CITY_DATA: Record<string, { state: string; lat: number; lng: number }> =
    {
      Mumbai: { state: "Maharashtra", lat: 19.076, lng: 72.8777 },
      Delhi: { state: "Delhi", lat: 28.7041, lng: 77.1025 },
      Bangalore: { state: "Karnataka", lat: 12.9716, lng: 77.5946 },
      Chennai: { state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
      Kolkata: { state: "West Bengal", lat: 22.5726, lng: 88.3639 },
      Hyderabad: { state: "Telangana", lat: 17.385, lng: 78.4867 },
      Pune: { state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
      Ahmedabad: { state: "Gujarat", lat: 23.0225, lng: 72.5714 },
      Jaipur: { state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
      Lucknow: { state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
      Other: { state: "Unknown", lat: 20.5937, lng: 78.9629 },
    };

  const handleNext = () => {
    const { fullName, gender, dob, height, weight, city } = formData;
    const newErrors: Record<string, string> = {};

    if (!fullName || !gender || !dob || !height || !weight || !city) {
      Alert.alert(
        "Missing Details",
        "Please fill all the details to continue.",
      );
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get State/Lat/Long from City
    const cityInfo = CITY_DATA[city] || CITY_DATA["Other"];

    // Sync with global context
    const updatedData = {
      fullName,
      gender,
      dateOfBirth: dob,
      height: parseFloat(height.replace("'", ".").replace('"', "")),
      weight: parseFloat(weight.replace(" kg", "")),
      city,
      state: cityInfo.state,
      country: "India",
      latitude: cityInfo.lat,
      longitude: cityInfo.lng,
    };

    updateProfileData(updatedData);

    // PERSISTENCE FIX: Save to backend immediately
    profileService
      .saveOrUpdateProfile({
        ...profileData, // Existing data
        ...updatedData, // New data
      })
      .catch((err) => console.error("Background save failed:", err));

    setErrors({});
    router.push("/complete-profile/religious-details");
  };

  return (
    <ProfileLayout
      title="Add Basic Details"
      stepTitle="Basic Information"
      currentStep={1}
      totalSteps={5}
      onBack={() => router.back()}
      onContinue={handleNext}
    >
      <CustomTextInput
        label="Full Name"
        value={formData.fullName}
        onChangeText={(text: string) => {
          setFormData({ ...formData, fullName: text });
          if (errors.fullName) setErrors({ ...errors, fullName: "" });
        }}
        placeholder="Enter your full name"
        error={errors.fullName}
      />

      <CustomDatePicker
        label="Date of Birth"
        value={formData.dob}
        onChange={(dateString: string) => {
          setFormData({ ...formData, dob: dateString });
          if (errors.dob) setErrors({ ...errors, dob: "" });
        }}
        error={errors.dob}
      />

      <CustomModalDropdown
        label="Height"
        value={formData.height}
        placeholder="Select Height"
        options={HEIGHT_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, height: val });
          if (errors.height) setErrors({ ...errors, height: "" });
        }}
        error={errors.height}
      />

      <CustomModalDropdown
        label="Weight"
        value={formData.weight}
        placeholder="Select Weight"
        options={WEIGHT_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, weight: val });
          if (errors.weight) setErrors({ ...errors, weight: "" });
        }}
        error={errors.weight}
      />

      <CustomModalDropdown
        label="City"
        value={formData.city}
        placeholder="Select City"
        options={CITY_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, city: val });
          if (errors.city) setErrors({ ...errors, city: "" });
        }}
        error={errors.city}
      />
    </ProfileLayout>
  );
};

export default BasicDetails;
