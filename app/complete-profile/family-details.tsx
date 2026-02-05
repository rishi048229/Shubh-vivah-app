import {
    Counter,
    CustomModalDropdown,
} from "@/components/complete-profile/FormControls";
import ProfileLayout from "@/components/complete-profile/ProfileLayout";
import { useProfile } from "@/context/ProfileContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";

const FATHER_OCCUPATIONS = [
  "Government Service",
  "Private Sector Job",
  "Self-Employed",
  "Business",
  "Professional (Teacher / Doctor / Nurse etc.)",
  "Retired",
  "Farmer",
  "Not Working",
  "Passed Away",
  "Other",
];

const MOTHER_OCCUPATIONS = [
  "Housewife",
  "Government Service",
  "Private Sector Job",
  "Self-Employed",
  "Business",
  "Professional (Teacher / Doctor / Nurse etc.)",
  "Retired",
  "Farmer",
  "Not Working",
  "Passed Away",
  "Other",
];
const FAMILY_TYPES = ["Joint Family", "Nuclear Family"];
const FAMILY_STATUS = ["Upper Class", "Middle Class", "Lower Class"];
const FAMILY_VALUES = ["Traditional", "Modern", "Liberal"];

const FamilyDetails = () => {
  const router = useRouter();
  const { updateProfileData } = useProfile();

  const [formData, setFormData] = useState({
    fatherOccupation: "",
    motherOccupation: "",
    brothers: 0,
    marriedBrothers: 0,
    sisters: 0,
    marriedSisters: 0,
    familyType: "",
    familyStatus: "",
    familyValues: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const {
      fatherOccupation,
      motherOccupation,
      familyType,
      familyStatus,
      familyValues,
    } = formData;
    const newErrors: Record<string, string> = {};

    if (!fatherOccupation)
      newErrors.fatherOccupation = "Please select your father's occupation";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Sync with context - all fields match backend ProfileDto
    updateProfileData({
      fatherOccupation,
      motherOccupation,
      brothers: formData.brothers,
      marriedBrothers: formData.marriedBrothers,
      sisters: formData.sisters,
      marriedSisters: formData.marriedSisters,
      familyType,
      familyStatus,
      familyValues,
    });

    setErrors({});
    router.push("/complete-profile/lifestyle-habits");
  };

  const updateCounter = (key: keyof typeof formData, delta: number) => {
    setFormData((prev) => {
      const currentVal = prev[key];
      // Type guard to ensure we only increment numeric values
      const newValue =
        typeof currentVal === "number"
          ? Math.max(0, currentVal + delta)
          : currentVal;
      return { ...prev, [key]: newValue };
    });
  };

  return (
    <ProfileLayout
      title="Add Family Details"
      stepTitle="Family Information"
      currentStep={4}
      totalSteps={5}
      onBack={() => router.back()}
      onContinue={handleNext}
    >
      <CustomModalDropdown
        label="Father's Occupation"
        value={formData.fatherOccupation}
        placeholder="Select Occupation"
        options={FATHER_OCCUPATIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, fatherOccupation: val });
          if (errors.fatherOccupation)
            setErrors({ ...errors, fatherOccupation: "" });
        }}
        error={errors.fatherOccupation}
      />

      <CustomModalDropdown
        label="Mother's Occupation"
        value={formData.motherOccupation}
        placeholder="Select Occupation"
        options={MOTHER_OCCUPATIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, motherOccupation: val });
          if (errors.motherOccupation)
            setErrors({ ...errors, motherOccupation: "" });
        }}
        error={errors.motherOccupation}
      />

      <Counter
        label="Brothers"
        value={formData.brothers}
        onIncrement={() => updateCounter("brothers", 1)}
        onDecrement={() => updateCounter("brothers", -1)}
      />

      <Counter
        label="Married Brothers"
        value={formData.marriedBrothers}
        onIncrement={() => updateCounter("marriedBrothers", 1)}
        onDecrement={() => updateCounter("marriedBrothers", -1)}
      />

      <Counter
        label="Sisters"
        value={formData.sisters}
        onIncrement={() => updateCounter("sisters", 1)}
        onDecrement={() => updateCounter("sisters", -1)}
      />

      <Counter
        label="Married Sisters"
        value={formData.marriedSisters}
        onIncrement={() => updateCounter("marriedSisters", 1)}
        onDecrement={() => updateCounter("marriedSisters", -1)}
      />

      <CustomModalDropdown
        label="Family Type"
        value={formData.familyType}
        placeholder="Select Type"
        options={FAMILY_TYPES}
        onSelect={(val: string) => {
          setFormData({ ...formData, familyType: val });
          if (errors.familyType) setErrors({ ...errors, familyType: "" });
        }}
        error={errors.familyType}
      />

      <CustomModalDropdown
        label="Family Status"
        value={formData.familyStatus}
        placeholder="Select Status"
        options={FAMILY_STATUS}
        onSelect={(val: string) => {
          setFormData({ ...formData, familyStatus: val });
          if (errors.familyStatus) setErrors({ ...errors, familyStatus: "" });
        }}
        error={errors.familyStatus}
      />

      <CustomModalDropdown
        label="Family Values"
        value={formData.familyValues}
        placeholder="Select Values"
        options={FAMILY_VALUES}
        onSelect={(val: string) => {
          setFormData({ ...formData, familyValues: val });
          if (errors.familyValues) setErrors({ ...errors, familyValues: "" });
        }}
        error={errors.familyValues}
      />
    </ProfileLayout>
  );
};

export default FamilyDetails;
