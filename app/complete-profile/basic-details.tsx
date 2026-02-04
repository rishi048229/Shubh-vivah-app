import {
    CustomDateInput,
    CustomModalDropdown,
    CustomPhoneInput,
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

import { useLocalSearchParams } from "expo-router";
// ...
const BasicDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialGender = typeof params.gender === "string" ? params.gender : "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: initialGender, // Initialize from params
    dob: "",
    height: "",
    weight: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const { fullName, email, phone, gender, dob, height, weight } = formData;
    const newErrors: Record<string, string> = {};

    if (
      !fullName ||
      !email ||
      !phone ||
      !gender ||
      !dob ||
      !height ||
      !weight
    ) {
      Alert.alert(
        "Missing Details",
        "Please fill all the details to continue.",
      );
      return;
    }

    // Simple validation for demo
    if (phone.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

      <CustomTextInput
        label="Email Address"
        value={formData.email}
        onChangeText={(text: string) => {
          setFormData({ ...formData, email: text });
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
      />

      <CustomPhoneInput
        label="Phone Number"
        value={formData.phone}
        onChangeText={(text: string) => {
          setFormData({ ...formData, phone: text });
          if (errors.phone) setErrors({ ...errors, phone: "" });
        }}
        placeholder="Enter phone number"
        error={errors.phone}
      />

      <CustomDateInput
        label="Date of Birth"
        value={formData.dob}
        onChangeText={(text: string) => {
          setFormData({ ...formData, dob: text });
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
    </ProfileLayout>
  );
};

export default BasicDetails;
