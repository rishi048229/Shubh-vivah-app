import { CustomModalDropdown } from "@/components/complete-profile/FormControls";
import ProfileLayout from "@/components/complete-profile/ProfileLayout";
import { useRouter } from "expo-router";
import React, { useState } from "react";

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
  const [formData, setFormData] = useState({
    education: "",
    workDetails: "",
    employmentType: "",
    occupation: "",
    annualIncome: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const { education, workDetails, employmentType, occupation, annualIncome } =
      formData;
    const newErrors = {};

    if (!education) newErrors.education = "Please select your education";
    // Other validations...

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    router.push("/complete-profile/family-details");
  };

  return (
    <ProfileLayout
      title="Add Educational & Career"
      stepTitle="Educational Information"
      currentStep={3}
      totalSteps={5}
      onContinue={handleNext}
    >
      <CustomModalDropdown
        label="Education"
        value={formData.education}
        placeholder="Select Education"
        options={EDUCATION_OPTIONS}
        onSelect={(val) => {
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
        onSelect={(val) => {
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
        onSelect={(val) => {
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
        onSelect={(val) => {
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
        onSelect={(val) => {
          setFormData({ ...formData, annualIncome: val });
          if (errors.annualIncome) setErrors({ ...errors, annualIncome: "" });
        }}
        error={errors.annualIncome}
      />
    </ProfileLayout>
  );
};

export default EducationCareerDetails;
