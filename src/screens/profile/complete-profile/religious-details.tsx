import {
    CustomModalDropdown,
    ProfileLayout,
    RadioGroup,
} from "@/components/Profile/CompleteProfileForm";
import { useProfileForm } from "@/context/ProfileFormContext";
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
  const {
    formData: contextData,
    updateFormData: saveToContext,
    isLoading,
  } = useProfileForm();

  const [formData, setFormData] = useState({
    religion: "Hindu",
    community: "",
    caste: "",
    manglikStatus: "",
    gothra: "",
    nakshatra: "",
    rashi: "",
  });

  React.useEffect(() => {
    if (!isLoading && contextData) {
      setFormData((prev) => ({
        ...prev,
        religion: contextData.religion || prev.religion,
        community: contextData.community || prev.community,
        caste: contextData.caste || prev.caste,
        manglikStatus: contextData.manglikStatus || prev.manglikStatus,
        gothra: contextData.gothra || prev.gothra,
        nakshatra: contextData.nakshatra || prev.nakshatra,
        rashi: contextData.rashi || prev.rashi,
      }));
    }
  }, [contextData, isLoading]);
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
    const newErrors: Record<string, string> = {};

    if (!religion) newErrors.religion = "Please select your religion";
    if (!community) newErrors.community = "Please select your community";
    if (!caste) newErrors.caste = "Please select your caste";
    if (!manglikStatus)
      newErrors.manglikStatus = "Please select your manglik status";
    if (!gothra) newErrors.gothra = "Please select your gothra";
    if (!nakshatra) newErrors.nakshatra = "Please select your nakshatra";
    if (!rashi) newErrors.rashi = "Please select your rashi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Validation Error", firstError);
      return;
    }

    setErrors({});
    saveToContext({
      religion: formData.religion,
      community: formData.community,
      caste: formData.caste,
      manglikStatus: formData.manglikStatus,
      gothra: formData.gothra,
      nakshatra: formData.nakshatra,
      rashi: formData.rashi,
    });
    router.push("/complete-profile/education-career" as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ProfileLayout
      title="Add Religious Details"
      stepTitle="Religious Information"
      currentStep={2}
      totalSteps={5}
      onBack={handleBack}
      onContinue={handleNext}
    >
      <CustomModalDropdown
        label="Religion"
        value={formData.religion}
        placeholder="Hindu"
        options={["Hindu"]}
        onSelect={(val: string) => {
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
        onSelect={(val: string) => {
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
        onSelect={(val: string) => {
          setFormData({ ...formData, caste: val });
          if (errors.caste) setErrors({ ...errors, caste: "" });
        }}
        error={errors.caste}
      />

      <RadioGroup
        label="Manglik Status"
        options={["Yes", "No"]}
        selectedOption={formData.manglikStatus}
        onSelect={(opt: string) => {
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
        onSelect={(val: string) => {
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
        onSelect={(val: string) => {
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
        onSelect={(val: string) => {
          setFormData({ ...formData, rashi: val });
          if (errors.rashi) setErrors({ ...errors, rashi: "" });
        }}
        error={errors.rashi}
      />
    </ProfileLayout>
  );
};

export default ReligiousDetails;
