import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "./api";

/**
 * Profile data interface matching UserProfileRequestDto / ResponseDto on backend.
 * Backend base path: /api/user-profiles
 */
export interface ProfileData {
  userId?: number;
  fullName: string;
  gender: string;
  dateOfBirth: string; // ISO date: "2000-01-15"
  height: number | null;
  weight: number | null;
  city?: string;

  // Religious
  religion?: string;
  community?: string;
  caste?: string;
  manglikStatus?: string;
  gothra?: string;
  nakshatra?: string;
  rashi?: string;

  // Education & Career
  highestEducation?: string; // used by form
  education?: string;        // used by backend response
  employmentType?: string;
  occupation?: string;
  annualIncome?: string | null;

  // Family
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number | null;
  marriedBrothers?: number | null;
  sisters?: number | null;
  marriedSisters?: number | null;
  familyType?: string;
  familyStatus?: string;
  familyValues?: string;

  // Lifestyle
  eatingHabits?: string;
  dietPreference?: string;
  drinking?: string | null;
  smoking?: string | null;
  healthNotes?: string;
  aboutMe?: string;
  subCaste?: string;
  fatherName?: string;
  motherName?: string;
  profileCreatedBy?: string;

  // Read-only (from server)
  profilePhotoUrl?: string;
  photos?: string[];
}

/**
 * POST /api/user-profiles — Create or update the current user's profile
 */
export async function saveProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const payload: any = { ...data };

  // Fetch userId if missing, as backend DTO requires it
  if (!payload.userId) {
    const storedUserId = Platform.OS === "web"
      ? localStorage.getItem("user_id")
      : await SecureStore.getItemAsync("user_id");
    if (storedUserId) {
      payload.userId = parseInt(storedUserId, 10);
    }
  }

  // --- Strict mapping dictionaries defined manually ---
  const rashiMap: Record<string, string> = {
    "Mesh": "ARIES", "Vrishabh": "TAURUS", "Mithun": "GEMINI", "Kark": "CANCER",
    "Singh": "LEO", "Kanya": "VIRGO", "Tula": "LIBRA", "Vrishchik": "SCORPIO",
    "Dhanu": "SAGITTARIUS", "Makar": "CAPRICORN", "Kumbh": "AQUARIUS", "Meen": "PISCES"
  };

  const annualIncomeMap: Record<string, string> = {
    "Below 2 Lakh": "BELOW_2_LAKH", "0 - 3 Lakhs": "BELOW_2_LAKH",
    "2 \u2013 5 Lakh": "BETWEEN_2_TO_5_LAKH", "2 - 5 Lakh": "BETWEEN_2_TO_5_LAKH", "3 - 6 Lakhs": "BETWEEN_2_TO_5_LAKH",
    "5 \u2013 10 Lakh": "BETWEEN_5_TO_10_LAKH", "5 - 10 Lakh": "BETWEEN_5_TO_10_LAKH", "6 - 10 Lakhs": "BETWEEN_5_TO_10_LAKH",
    "10 \u2013 20 Lakh": "BETWEEN_10_TO_20_LAKH", "10 - 20 Lakh": "BETWEEN_10_TO_20_LAKH", "10 - 15 Lakhs": "BETWEEN_10_TO_20_LAKH",
    "20 \u2013 50 Lakh": "BETWEEN_20_TO_50_LAKH", "20 - 50 Lakh": "BETWEEN_20_TO_50_LAKH",
    "Above 50 Lakh": "ABOVE_50_LAKH", "15+ Lakhs": "ABOVE_50_LAKH"
  };

  const educationMap: Record<string, string> = {
    "High School": "HIGH_SCHOOL",
    "Bachelor's": "BACHELORS",
    "Master's": "MASTERS",
    "PhD": "PHD",
    "Other": "OTHER"
  };

  const empTypeMap: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Contract": "CONTRACT",
    "Freelance": "FREELANCING"
  };

  // The frontend form asks for both "Work Details" (sector) and "Occupation" (role), but saves only the role into `occupation` state.
  // The backend `OccupationType` only accepts sectors. Let's map frontend roles to backend generic sectors.
  const occupationMap: Record<string, string> = {
    "Software Engineer": "PRIVATE_SECTOR",
    "Doctor": "OTHER",
    "Teacher": "OTHER",
    "Banker": "PRIVATE_SECTOR",
    "Engineer": "PRIVATE_SECTOR",
    "Other": "OTHER",
    // Also mapping the family occupation form options (which share the same OccupationType enum)
    "Government Service": "GOVERNMENT_SERVICE",
    "Private Sector Job": "PRIVATE_SECTOR",
    "Self-Employed": "BUSINESS",
    "Business": "BUSINESS",
    "Professional (Teacher / Doctor / Nurse etc.)": "OTHER",
    "Retired": "RETIRED",
    "Farmer": "FARMER",
    "Not Working": "NOT_WORKING",
    "Passed Away": "OTHER",
  };

  // Helper to generically format string -> Backend Enum (e.g. "Upper Class" -> "UPPER_CLASS")
  const formatEnum = (val: any) => {
    if (typeof val === "string") {
      let formatted = val.trim().toUpperCase().replace(/[\s\-\/]+/g, "_");
      if (formatted === "MRIGASHIRA") return "MRIGASHIRSHA";
      return formatted;
    }
    return val;
  };

  const simpleEnumFields = [
    "gender",
    "manglikStatus",
    "nakshatra",
    "familyType",
    "familyStatus",
    "familyValues",
    "dietPreference",
    "profileCreatedBy",
  ];

  simpleEnumFields.forEach((field) => {
    if (payload[field]) {
      payload[field] = formatEnum(payload[field]);
    }
  });

  // Apply specific maps
  if (payload.rashi) payload.rashi = rashiMap[payload.rashi.toString()] || formatEnum(payload.rashi);

  if (payload.annualIncome !== undefined && payload.annualIncome !== null) {
    let incomeStr = payload.annualIncome.toString();
    // Handle cases where the context is stuck with numbers (e.g., 15 for "15+ Lakhs")
    if (incomeStr === "0" || incomeStr === "3") incomeStr = "0 - 3 Lakhs";
    if (incomeStr === "6") incomeStr = "6 - 10 Lakhs";
    if (incomeStr === "10") incomeStr = "10 - 15 Lakhs";
    if (incomeStr === "15" || incomeStr === "20" || incomeStr === "50") incomeStr = "15+ Lakhs";

    payload.annualIncome = annualIncomeMap[incomeStr] || formatEnum(incomeStr);
  }
  if (payload.highestEducation) {
    payload.education = educationMap[payload.highestEducation] || formatEnum(payload.highestEducation);
    delete payload.highestEducation;
  }
  if (payload.employmentType) payload.employmentType = empTypeMap[payload.employmentType] || formatEnum(payload.employmentType);
  if (payload.occupation) payload.occupation = occupationMap[payload.occupation] || "OTHER";
  if (payload.fatherOccupation) payload.fatherOccupation = occupationMap[payload.fatherOccupation] || "OTHER";
  if (payload.motherOccupation) payload.motherOccupation = occupationMap[payload.motherOccupation] || "OTHER";

  // Renamed & custom map fields
  if (payload.eatingHabits) {
    payload.eatingHabit = formatEnum(payload.eatingHabits);
    delete payload.eatingHabits;
  }

  // Habit Enums (YES, NO, OCCASIONALLY)
  if (payload.drinking) {
    payload.drinkingHabit = formatEnum(payload.drinking);
    delete payload.drinking;
  }
  if (payload.smoking) {
    payload.smokingHabit = formatEnum(payload.smoking);
    delete payload.smoking;
  }

  // Date
  if (payload.dateOfBirth && payload.dateOfBirth.includes("/")) {
    const [day, month, year] = payload.dateOfBirth.split("/");
    if (day && month && year) {
      payload.dateOfBirth = `${year}-${month}-${day}`;
    }
  }

  const res = await api.post("/api/user-profiles", payload);
  return res.data;
}

/**
 * GET /api/user-profiles — Get the current user's profile
 * For new users, this may return 404. We catch it and return an empty profile.
 */
export async function getProfile(): Promise<ProfileData> {
  try {
    const res = await api.get("/api/user-profiles");
    return res.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log("Profile not found (404). Returning empty default profile.");
      return {
        fullName: "",
        gender: "",
        dateOfBirth: "",
        height: null,
        weight: null,
      };
    }
    throw error;
  }
}

/**
 * POST /api/user-profiles/photos — Upload photos (multipart)
 * Accepts mainPhoto and/or extraPhotos
 */
export async function uploadProfilePhoto(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("mainPhoto", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    name: filename,
    type,
  } as any);

  const res = await api.post("/api/user-profiles/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * POST /api/user-profiles/photos — Upload additional photos (multipart)
 */
export async function uploadAdditionalPhotos(uris: string[]): Promise<string> {
  const formData = new FormData();

  uris.forEach((uri) => {
    const filename = uri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("extraPhotos", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name: filename,
      type,
    } as any);
  });

  const res = await api.post("/api/user-profiles/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * PUT /api/user-profiles/photos/main — Update main profile photo
 */
export async function updateMainPhoto(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    name: filename,
    type,
  } as any);

  const res = await api.put("/api/user-profiles/photos/main", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * DELETE /api/user-profiles/photos/main — Delete main profile photo
 */
export async function deleteProfilePhoto(): Promise<string> {
  const res = await api.delete("/api/user-profiles/photos/main");
  return res.data;
}

/**
 * DELETE /api/user-profiles/photos/:photoId — Delete a specific extra photo
 */
export async function deleteAdditionalPhoto(photoId: number): Promise<string> {
  const res = await api.delete(`/api/user-profiles/photos/${photoId}`);
  return res.data;
}

/**
 * DELETE /api/user-profiles — Delete current user's profile
 */
export async function deleteProfile(): Promise<void> {
  await api.delete("/api/user-profiles");
}

/**
 * Calculates profile completion percentage globally.
 */
export function calculateProfileCompletion(profile: any): {
  percentage: number;
  missingFields: string[];
} {
  const fields = [
    { key: "fullName", label: "Full Name" },
    { key: "gender", label: "Gender" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "city", label: "City" },
    { key: "religion", label: "Religion" },
    { key: "community", label: "Community" },
    { key: "caste", label: "Caste" },
    { key: "highestEducation", label: "Education" },
    { key: "education", label: "Education" },
    { key: "occupation", label: "Occupation" },
    { key: "annualIncome", label: "Annual Income" },
    { key: "familyType", label: "Family Type" },
    { key: "aboutMe", label: "About Me" },
    { key: "profilePhotoUrl", label: "Profile Photo" },
    { key: "manglikStatus", label: "Manglik Status" },
    { key: "rashi", label: "Rashi" },
    { key: "nakshatra", label: "Nakshatra" },
    { key: "eatingHabits", label: "Eating Habits" },
  ];

  if (!profile)
    return {
      percentage: 0,
      missingFields: fields.map((f) => f.label),
    };

  let filled = 0;
  const missing: string[] = [];
  const seen = new Set<string>();

  fields.forEach((f) => {
    if (seen.has(f.label)) return;

    // Check both potential mapped keys (e.g. eatingHabits vs eatingHabit)
    let val = profile[f.key];
    if (f.key === "eatingHabits") val = val || profile.eatingHabit;
    if (f.key === "highestEducation") val = val || profile.education;

    if (
      val !== null &&
      val !== undefined &&
      val !== "" &&
      val !== 0 &&
      val !== "NOT_SPECIFIED"
    ) {
      filled++;
    } else {
      missing.push(f.label);
    }
    seen.add(f.label);
  });

  const uniqueFieldCount = seen.size;
  const pct = Math.round((filled / uniqueFieldCount) * 100);
  return { percentage: pct > 100 ? 100 : pct, missingFields: missing };
}
