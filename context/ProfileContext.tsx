import { ProfileDto } from "@/services/profileService";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ProfileContextType {
  profileData: Partial<ProfileDto>;
  updateProfileData: (data: Partial<ProfileDto>) => void;
  resetProfileData: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Partial<ProfileDto>>({});

  const updateProfileData = (data: Partial<ProfileDto>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const resetProfileData = () => {
    setProfileData({});
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, updateProfileData, resetProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
