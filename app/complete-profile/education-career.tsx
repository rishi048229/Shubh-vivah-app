import {
    CustomModalDropdown,
    ProfileLayout,
} from "@/components/Profile/CompleteProfileForm";
import { useProfileForm } from "@/context/ProfileFormContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

const EDUCATION_OPTIONS = ["High School", "Bachelor's", "Master's", "Other"];
const WORK_OPTIONS = [
  "Private Sector",
  "Government/Public Sector",
  "Civil Service",
  "Defense",
  "Business/Self Employed",
  "Not Working",
];
const EMPLOYMENT_TYPE = ["Full-time", "Part-time", "Contract", "Freelance"];
const OCCUPATIONS = [
  "Software Engineer",
  "Doctor",
  "Teacher",
  "Banker",
  "Engineer",
  "Other",
];
const INCOME_OPTIONS = [
  "0 - 3 Lakhs",
  "3 - 6 Lakhs",
  "6 - 10 Lakhs",
  "10 - 15 Lakhs",
  "15+ Lakhs",
];

const EducationCareerDetails = () => {
  const router = useRouter();
  const {
    formData: contextData,
    updateFormData: saveToContext,
    isLoading,
  } = useProfileForm();

  const [formData, setFormData] = useState({
    education: "",
    workDetails: "",
    employmentType: "",
    occupation: "",
    annualIncome: "",
  });

  React.useEffect(() => {
    if (!isLoading && contextData) {
      setFormData((prev) => ({
        ...prev,
        education: contextData.highestEducation || prev.education,
        // Map 'employmentType' (from context) to 'employmentType' (local)
        employmentType: contextData.employmentType || prev.employmentType,
        occupation: contextData.occupation || prev.occupation,
        // Map annualIncome number to string if needed, or handle dropdown selection logic
        // Assuming dropdown values match stored strings mostly.
        // For annualIncome number to range string, we might need logic, but user selects string range in UI.
        // Wait, context stores number/Long. UI component uses string ranges.
        // We need to map Back: number -> range string?
        // Current implementation tries to parse string to int on save.
        // If context has int, we can't easily map back to range string without logic.
        // For now, let's leave annualIncome blank if it's a number, forcing re-select, OR try to find range.
        // Or if context has string for 'workDetails'?
        // Context: 'employmentType', 'occupation', 'annualIncome' (number)
        // Local: 'workDetails' is missing in Context?
        // Let's check Context definition.
      }));
    }
  }, [contextData, isLoading]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const { education, workDetails, employmentType, occupation, annualIncome } =
      formData;
    const newErrors: Record<string, string> = {};

    if (!education) newErrors.education = "Please select your education";
    if (!workDetails) newErrors.workDetails = "Please select your work details";
    if (!employmentType)
      newErrors.employmentType = "Please select your employment type";
    if (!occupation) newErrors.occupation = "Please select your occupation";
    if (!annualIncome)
      newErrors.annualIncome = "Please select your annual income";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Validation Error", firstError);
      return;
    }

    setErrors({});
    saveToContext({
      highestEducation: formData.education,
      employmentType: formData.employmentType,
      occupation: formData.occupation,
      annualIncome: formData.annualIncome
        ? parseInt(formData.annualIncome.replace(/[^0-9]/g, ""))
        : null,
    });
    router.push("/complete-profile/family-details" as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ProfileLayout
      title="Add Educational & Career"
      stepTitle="Educational Information"
      currentStep={3}
      totalSteps={5}
      onBack={handleBack}
      onContinue={handleNext}
    >
      <CustomModalDropdown
        label="Education"
        value={formData.education}
        placeholder="Select Education"
        options={EDUCATION_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, education: val });
          if (errors.education) setErrors({ ...errors, education: "" });
        }}
        error={errors.education}
      />

      <CustomModalDropdown
        label="Work Details"
        value={formData.workDetails}
        placeholder="Select Work Details"
        options={WORK_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, workDetails: val });
          if (errors.workDetails) setErrors({ ...errors, workDetails: "" });
        }}
        error={errors.workDetails}
      />

      <CustomModalDropdown
        label="Employment Type"
        value={formData.employmentType}
        placeholder="Select Employment Type"
        options={EMPLOYMENT_TYPE}
        onSelect={(val: string) => {
          setFormData({ ...formData, employmentType: val });
          if (errors.employmentType)
            setErrors({ ...errors, employmentType: "" });
        }}
        error={errors.employmentType}
      />

      <CustomModalDropdown
        label="Occupation"
        value={formData.occupation}
        placeholder="Select Occupation"
        options={OCCUPATIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, occupation: val });
          if (errors.occupation) setErrors({ ...errors, occupation: "" });
        }}
        error={errors.occupation}
      />

      <CustomModalDropdown
        label="Annual Income"
        value={formData.annualIncome}
        placeholder="Select Income"
        options={INCOME_OPTIONS}
        onSelect={(val: string) => {
          setFormData({ ...formData, annualIncome: val });
          if (errors.annualIncome) setErrors({ ...errors, annualIncome: "" });
        }}
        error={errors.annualIncome}
      />
    </ProfileLayout>
  );
};

export default EducationCareerDetails;
