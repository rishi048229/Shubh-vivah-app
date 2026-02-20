import { Platform } from "react-native";
import api from "./api";

export interface ProfileData {
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
  highestEducation?: string;
  employmentType?: string;
  occupation?: string;
  annualIncome?: number | null;

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
  drinking?: boolean | null;
  smoking?: boolean | null;
  healthNotes?: string;
  aboutMe?: string;

  // Read-only (from server)
  profilePhotoUrl?: string;
  additionalPhotos?: string[];
}

/**
 * POST /profile — Create or update the current user's profile
 */
export async function saveProfile(data: Partial<ProfileData>): Promise<string> {
  const res = await api.post("/profile", data);
  return res.data;
}

/**
 * GET /profile — Get the current user's profile
 */
export async function getProfile(): Promise<ProfileData> {
  const res = await api.get("/profile");
  return res.data;
}

/**
 * POST /profile/photo — Upload main profile photo (multipart)
 */
export async function uploadProfilePhoto(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    name: filename,
    type,
  } as any);

  const res = await api.post("/profile/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * POST /profile/photos — Upload additional photos (multipart, max 5)
 */
export async function uploadAdditionalPhotos(uris: string[]): Promise<string> {
  const formData = new FormData();

  uris.forEach((uri) => {
    const filename = uri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("files", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name: filename,
      type,
    } as any);
  });

  const res = await api.post("/profile/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * PUT /profile/location?lat=&lng= — Update GPS location
 */
export async function updateLocation(
  lat: number,
  lng: number,
): Promise<string> {
  const res = await api.put(`/profile/location?lat=${lat}&lng=${lng}`);
  return res.data;
}

/**
 * DELETE /profile/photo — Delete main profile photo
 */
export async function deleteProfilePhoto(): Promise<string> {
  const res = await api.delete("/profile/photo");
  return res.data;
}

/**
 * DELETE /profile/photos/:photoId — Delete an additional photo
 */
export async function deleteAdditionalPhoto(photoId: number): Promise<string> {
  const res = await api.delete(`/profile/photos/${photoId}`);
  return res.data;
}

/**
 * GET /profile/photos/:ownerId — Get additional photos (requires match)
 */
export async function getAdditionalPhotos(ownerId: number): Promise<string[]> {
  const res = await api.get(`/profile/photos/${ownerId}`);
  return res.data;
}
