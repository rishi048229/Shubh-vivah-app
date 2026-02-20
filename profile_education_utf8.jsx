import { useState } from "react";
import { Alert } from "react-native";
import { CustomModalDropdown } from "./components/FormControls";
import ProfileLayout from "./components/ProfileLayout";

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
  "16+ Lakhs",
];

const EducationCareerDetails = ({ navigation }) => {
  const [formData, setFormData] = useState({
    education: "",
    workDetails: "",
    employmentType: "",
    occupation: "",
    annualIncome: "",
  });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    console.log("EducationCareerDetails: handleNext called");
    const { education, workDetails, employmentType, occupation, annualIncome } =
      formData;
    const newErrors = {};

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
    console.log("EducationCareerDetails: Navigating to FamilyDetails");
    navigation.navigate("FamilyDetails");
  };

  const handleBack = () => {
    navigation.goBack();
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
