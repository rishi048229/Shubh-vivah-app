import {
  CustomDateInput,
  CustomModalDropdown,
  CustomTextInput,
  ProfileLayout,
  RadioGroup
} from "@/components/Profile/CompleteProfileForm";
import { useProfileForm } from "@/context/ProfileFormContext";
import { useLocalSearchParams, useRouter } from "expo-router";
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
const PROFILE_CREATED_BY_OPTIONS = [
  "Self",
  "Parent",
  "Sibling",
  "Relative",
  "Friend",
];

const BasicDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    formData: contextData,
    updateFormData: saveToContext,
    isLoading,
  } = useProfileForm();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    city: "",
    fatherName: "",
    motherName: "",
    profileCreatedBy: "",
  });

  // Sync local state with context data once loaded
  React.useEffect(() => {
    if (!isLoading && contextData) {
      setFormData((prev) => ({
        ...prev,
        fullName: contextData.fullName || prev.fullName,
        email: contextData.email || prev.email,
        phone: contextData.phone || prev.phone,
        gender: contextData.gender || (params?.gender as string) || prev.gender,
        dob: contextData.dateOfBirth || prev.dob,
        height: contextData.height ? `${contextData.height}` : prev.height, // You might need formatting logic here if height is stored as number but displayed with units
        weight: contextData.weight ? `${contextData.weight} kg` : prev.weight,
        city: contextData.city || prev.city,
        fatherName: contextData.fatherName || prev.fatherName,
        motherName: contextData.motherName || prev.motherName,
        profileCreatedBy: contextData.profileCreatedBy || prev.profileCreatedBy,
      }));
    }
  }, [contextData, isLoading, params?.gender]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const {
      gender,
      dob,
      height,
      weight,
      city,
      fatherName,
      motherName,
      profileCreatedBy,
    } = formData;
    const newErrors: Record<string, string> = {};

    // Validation: remove strict checks for fields not in this form (they come from context/auth)
    // We only validate what the user enters here: Father, Mother, CreatedBy, Gender, DOB, Height, Weight, City

    /* 
    // These are already in context from registration, we don't ask again
    if (
      !fullName ||
      !email ||
      !phone
    ) { ... }
    */

    if (
      !gender ||
      !dob ||
      !height ||
      !weight ||
      !city ||
      !fatherName ||
      !motherName ||
      !profileCreatedBy
    ) {
      Alert.alert(
        "Missing Details",
        "Please fill all the details to continue.",
      );
      return;
    }

    // Removed name/email/phone validation logic as they are not editable here

    if (!gender) newErrors.gender = "Please select your gender";
    if (!dob) newErrors.dob = "Please select your date of birth";
    if (!height) newErrors.height = "Please select your height";
    if (!weight) newErrors.weight = "Please select your weight";
    if (!city) newErrors.city = "Please enter your city";
    if (!fatherName) newErrors.fatherName = "Please enter father's full name";
    if (!motherName) newErrors.motherName = "Please enter mother's name";
    if (!profileCreatedBy)
      newErrors.profileCreatedBy = "Please select who created this profile";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Validation Error", firstError);
      return;
    }

    setErrors({});
    saveToContext({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dateOfBirth: formData.dob,
      city: formData.city.trim(),
      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      profileCreatedBy: formData.profileCreatedBy,
      height: formData.height
        ? parseFloat(formData.height.replace(/[^0-9.]/g, ""))
        : null,
      weight: formData.weight
        ? parseFloat(formData.weight.replace(/[^0-9.]/g, ""))
        : null,
    });
    router.push("/complete-profile/religious-details" as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ProfileLayout
      title="Add Basic Details"
      stepTitle="Basic Information"
      currentStep={1}
      totalSteps={5}
      onBack={handleBack}
      onContinue={handleNext}
    >
      <CustomTextInput
        label="Father's Full Name"
        value={formData.fatherName}
        onChangeText={(text: string) => {
          setFormData({ ...formData, fatherName: text });
          if (errors.fatherName) setErrors({ ...errors, fatherName: "" });
        }}
        placeholder="Enter father's full name"
        error={errors.fatherName}
      />

      <CustomTextInput
        label="Mother's Name"
        value={formData.motherName}
        onChangeText={(text: string) => {
          setFormData({ ...formData, motherName: text });
          if (errors.motherName) setErrors({ ...errors, motherName: "" });
        }}
        placeholder="Enter mother's full name"
        error={errors.motherName}
      />

      <CustomModalDropdown
        label="Profile Created By"
        value={formData.profileCreatedBy}
        placeholder="Select Relation"
        options={PROFILE_CREATED_BY_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, profileCreatedBy: val });
          if (errors.profileCreatedBy)
            setErrors({ ...errors, profileCreatedBy: "" });
        }}
        error={errors.profileCreatedBy}
      />

      <CustomTextInput
        label="Current City"
        value={formData.city}
        onChangeText={(text: string) => {
          setFormData({ ...formData, city: text });
          if (errors.city) setErrors({ ...errors, city: "" });
        }}
        placeholder="Enter your current city"
        error={errors.city}
      />

      <RadioGroup
        label="Gender"
        options={["Male", "Female"]}
        selectedOption={formData.gender}
        onSelect={(opt: string) => {
          setFormData({ ...formData, gender: opt });
          if (errors.gender) setErrors({ ...errors, gender: "" });
        }}
        error={errors.gender}
      />

      <CustomDateInput
        label="Date of Birth"
        value={formData.dob}
        onChange={(date: string) => {
          setFormData({ ...formData, dob: date });
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
