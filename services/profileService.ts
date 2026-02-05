import api from "./api";

export interface ProfileDto {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  height?: number;
  weight?: number;
  city?: string;
  religion?: string;
  community?: string;
  caste?: string;
  manglikStatus?: string;
  gothra?: string;
  nakshatra?: string;
  rashi?: string;
  highestEducation?: string;
  employmentType?: string;
  occupation?: string;
  annualIncome?: number;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  marriedBrothers?: number;
  sisters?: number;
  marriedSisters?: number;
  familyType?: string;
  familyStatus?: string;
  familyValues?: string;
  eatingHabits?: string;
  dietPreference?: string;
  drinking?: boolean;
  smoking?: boolean;
  healthNotes?: string;
  aboutMe?: string;
}

export const profileService = {
  // Get Profile
  getProfile: async (): Promise<ProfileDto> => {
    const response = await api.get<ProfileDto>("/profile");
    return response.data;
  },

  // Create or Update Profile
  saveOrUpdateProfile: async (profileData: ProfileDto) => {
    return api.post("/profile", profileData);
  },
};
