import {
    Counter,
    CustomModalDropdown,
    ProfileLayout,
} from "@/components/Profile/CompleteProfileForm";
import { useProfileForm } from "@/context/ProfileFormContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

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
  const {
    formData: contextData,
    updateFormData: saveToContext,
    isLoading,
  } = useProfileForm();

  const [formData, setFormData] = useState({
    fatherOccupation: "",
    motherOccupation: "",
    brothers: 0,
    sisters: 0,
    familyType: "",
    familyStatus: "",
    familyValues: "",
  });

  React.useEffect(() => {
    if (!isLoading && contextData) {
      setFormData((prev) => ({
        ...prev,
        fatherOccupation: contextData.fatherOccupation || prev.fatherOccupation,
        motherOccupation: contextData.motherOccupation || prev.motherOccupation,
        brothers: contextData.brothers ?? prev.brothers,
        sisters: contextData.sisters ?? prev.sisters,
        familyType: contextData.familyType || prev.familyType,
        familyStatus: contextData.familyStatus || prev.familyStatus,
        familyValues: contextData.familyValues || prev.familyValues,
      }));
    }
  }, [contextData, isLoading]);
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
    if (!motherOccupation)
      newErrors.motherOccupation = "Please select your mother's occupation";
    if (!familyType) newErrors.familyType = "Please select your family type";
    if (!familyStatus)
      newErrors.familyStatus = "Please select your family status";
    if (!familyValues)
      newErrors.familyValues = "Please select your family values";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Validation Error", firstError);
      return;
    }

    setErrors({});
    saveToContext({
      fatherOccupation: formData.fatherOccupation,
      motherOccupation: formData.motherOccupation,
      brothers: formData.brothers,
      marriedBrothers: null,
      sisters: formData.sisters,
      marriedSisters: null,
      familyType: formData.familyType,
      familyStatus: formData.familyStatus,
      familyValues: formData.familyValues,
    });
    router.push("/complete-profile/lifestyle-habits" as any);
  };

  const handleBack = () => {
    router.back();
  };

  const updateCounter = (key: "brothers" | "sisters", delta: number) => {
    setFormData((prev) => {
      const newValue = Math.max(0, prev[key] + delta);
      return { ...prev, [key]: newValue };
    });
  };

  return (
    <ProfileLayout
      title="Add Family Details"
      stepTitle="Family Information"
      currentStep={4}
      totalSteps={5}
      onBack={handleBack}
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
        label="Sisters"
        value={formData.sisters}
        onIncrement={() => updateCounter("sisters", 1)}
        onDecrement={() => updateCounter("sisters", -1)}
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
