import {
  CustomModalDropdown,
  RadioGroup,
} from "@/components/complete-profile/FormControls";
import ProfileLayout from "@/components/complete-profile/ProfileLayout";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

const RELIGIONS = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Jain",
  "Buddhist",
  "Other",
];
const COMMUNITIES = [
  "Brahmin",
  "Maratha",
  "Kshatriya",
  "Rajput",
  "Vaishya",
  "Baniya",
  "Kayastha",
  "Jat",
  "Yadav",
  "Reddy",
  "Naidu",
  "Nair",
  "Lingayat",
  "Other",
];
const CASTES = ["Brahmin", "Maratha", "Rajput", "Yadav", "Kshatriya", "Other"];
const GOTRAS = ["Kashyap", "Bharadwaj", "Vashishtha", "Gautam", "Other"];
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
const RASHIS = [
  "Mesh",
  "Vrishabh",
  "Mithun",
  "Kark",
  "Singh",
  "Kanya",
  "Tula",
  "Vrishchik",
  "Dhanu",
  "Makar",
  "Kumbh",
  "Meen",
];

const ReligiousDetails = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    religion: "Hindu",
    community: "",
    caste: "",
    manglikStatus: "",
    gothra: "",
    nakshatra: "",
    rashi: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const {
      religion,
      community,
      caste,
      manglikStatus,
      gothra,
      nakshatra,
      rashi,
    } = formData;
    const newErrors = {};

    if (!religion) newErrors.religion = "Please select your religion";
    if (!community) newErrors.community = "Please select your community";
    // if (!caste) newErrors.caste = 'Please select your caste';
    // Relaxing validation for demo

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Validation Error", firstError);
      return;
    }

    setErrors({});
    router.push("/complete-profile/education-details");
  };

  return (
    <ProfileLayout
      title="Add Religious Details"
      stepTitle="Religious Information"
      currentStep={2}
      totalSteps={5}
      onContinue={handleNext}
    >
      <CustomModalDropdown
        label="Religion"
        value={formData.religion}
        placeholder="Hindu"
        options={RELIGIONS}
        onSelect={(val) => {
          setFormData({ ...formData, religion: val });
          if (errors.religion) setErrors({ ...errors, religion: "" });
        }}
        error={errors.religion}
      />

      <CustomModalDropdown
        label="Community"
        value={formData.community}
        placeholder="Select Community"
        options={COMMUNITIES}
        onSelect={(val) => {
          setFormData({ ...formData, community: val });
          if (errors.community) setErrors({ ...errors, community: "" });
        }}
        error={errors.community}
      />

      <CustomModalDropdown
        label="Caste"
        value={formData.caste}
        placeholder="Select Caste"
        options={CASTES}
        onSelect={(val) => {
          setFormData({ ...formData, caste: val });
          if (errors.caste) setErrors({ ...errors, caste: "" });
        }}
        error={errors.caste}
      />

      <RadioGroup
        label="Manglik Status"
        options={["Yes", "No"]}
        selectedOption={formData.manglikStatus}
        onSelect={(opt) => {
          setFormData({ ...formData, manglikStatus: opt });
          if (errors.manglikStatus) setErrors({ ...errors, manglikStatus: "" });
        }}
        error={errors.manglikStatus}
      />

      <CustomModalDropdown
        label="Gothra"
        value={formData.gothra}
        placeholder="Select Gotra"
        options={GOTRAS}
        onSelect={(val) => {
          setFormData({ ...formData, gothra: val });
          if (errors.gothra) setErrors({ ...errors, gothra: "" });
        }}
        error={errors.gothra}
      />

      <CustomModalDropdown
        label="Nakshatra"
        value={formData.nakshatra}
        placeholder="Select Nakshatra"
        options={NAKSHATRAS}
        onSelect={(val) => {
          setFormData({ ...formData, nakshatra: val });
          if (errors.nakshatra) setErrors({ ...errors, nakshatra: "" });
        }}
        error={errors.nakshatra}
      />

      <CustomModalDropdown
        label="Rashi (Moon Sign)"
        value={formData.rashi}
        placeholder="Select Rashi"
        options={RASHIS}
        onSelect={(val) => {
          setFormData({ ...formData, rashi: val });
          if (errors.rashi) setErrors({ ...errors, rashi: "" });
        }}
        error={errors.rashi}
      />
    </ProfileLayout>
  );
};

export default ReligiousDetails;
