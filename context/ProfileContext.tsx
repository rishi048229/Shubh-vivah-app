import { ProfileDto, profileService } from "@/services/profileService";
import * as SecureStore from "expo-secure-store";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface SettingsState {
  notificationsEnabled: boolean;
  profileVisibility: boolean;
  matchNotifications: boolean;
  messageNotifications: boolean;
  horoscopeAlerts: boolean;
}

interface ProfileContextType {
  // Profile Data
  profileData: Partial<ProfileDto>;
  updateProfileData: (data: Partial<ProfileDto>) => void;
  resetProfileData: () => void;
  clearAllUserData: () => Promise<void>;

  // Profile Image (local storage)
  profileImage: string | null;
  setProfileImage: (uri: string) => Promise<void>;

  // Additional Photos (max 5)
  additionalPhotos: string[];
  addPhoto: (uri: string) => Promise<boolean>;
  removePhoto: (index: number) => Promise<void>;

  // Completion Status
  isProfileComplete: boolean;
  completionPercentage: number;

  // Settings (persisted to backend)
  settings: SettingsState;
  updateSettings: (key: keyof SettingsState, value: boolean) => Promise<void>;

  // Loading States
  isLoading: boolean;
  isSavingSettings: boolean;

  // Actions
  refreshProfile: () => Promise<void>;
}

const DEFAULT_SETTINGS: SettingsState = {
  notificationsEnabled: true,
  profileVisibility: true,
  matchNotifications: true,
  messageNotifications: true,
  horoscopeAlerts: false,
};

const PROFILE_IMAGE_KEY = "profile_image_uri";
const ADDITIONAL_PHOTOS_KEY = "additional_photos";
const SETTINGS_KEY = "profile_settings";
const PROFILE_DATA_KEY = "profile_data_draft"; // New key for data persistence
const MAX_ADDITIONAL_PHOTOS = 5;

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Partial<ProfileDto>>({});
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load stored data (exposed as refreshProfile)
  const loadStoredData = useCallback(async () => {
    try {
      // 1. Check for Auth Token FIRST
      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) {
        console.log("No token found, skipping profile fetch.");
        return; // Will set loading false in finally
      }

      // 2. Load profile image from secure store
      const storedImage = await SecureStore.getItemAsync(PROFILE_IMAGE_KEY);
      if (storedImage) {
        setProfileImageState(storedImage);
      }

      // 3. Load additional photos
      const storedPhotos = await SecureStore.getItemAsync(
        ADDITIONAL_PHOTOS_KEY,
      );
      if (storedPhotos) {
        setAdditionalPhotos(JSON.parse(storedPhotos));
      }

      // 4. Load settings from secure store
      const storedSettings = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      // 5. Load LOCAL profile data first (to restore draft)
      const storedProfileData =
        await SecureStore.getItemAsync(PROFILE_DATA_KEY);
      if (storedProfileData) {
        setProfileData(JSON.parse(storedProfileData));
      }

      // 6. Load profile data from backend (overwrites local if successful)
      try {
        const profile = await profileService.getProfile();
        if (profile && Object.keys(profile).length > 0) {
          setProfileData(profile);
          await SecureStore.setItemAsync(
            PROFILE_DATA_KEY,
            JSON.stringify(profile),
          );
        }
      } catch (err) {
        console.log("No backend profile found, using local draft.");
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    let isMounted = true;

    // Create a timeout that ALWAYS resolves after 2 seconds
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("⏰ Loading timeout reached, forcing app to proceed.");
        resolve();
      }, 2000);
    });

    // Race: whichever finishes first, we proceed
    Promise.race([loadStoredData(), timeoutPromise]).finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadStoredData]);

  const updateProfileData = (data: Partial<ProfileDto>) => {
    setProfileData((prev) => {
      const newData = { ...prev, ...data };
      // Persist to SecureStore
      SecureStore.setItemAsync(PROFILE_DATA_KEY, JSON.stringify(newData)).catch(
        (err) => console.error("Failed to save profile draft", err),
      );
      return newData;
    });
  };

  const resetProfileData = () => {
    setProfileData({});
  };

  // Clear all user data (for logout)
  const clearAllUserData = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(PROFILE_IMAGE_KEY);
      await SecureStore.deleteItemAsync(ADDITIONAL_PHOTOS_KEY);
      await SecureStore.deleteItemAsync(SETTINGS_KEY);
      setProfileData({});
      setProfileImageState(null);
      setAdditionalPhotos([]);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }, []);

  // Set profile image and persist to local storage
  const setProfileImage = useCallback(async (uri: string) => {
    try {
      await SecureStore.setItemAsync(PROFILE_IMAGE_KEY, uri);
      setProfileImageState(uri);
    } catch (error) {
      console.error("Error saving profile image:", error);
      throw error;
    }
  }, []);

  // Add a photo to additional photos (max 5)
  const addPhoto = useCallback(
    async (uri: string): Promise<boolean> => {
      if (additionalPhotos.length >= MAX_ADDITIONAL_PHOTOS) {
        return false; // Max reached
      }
      try {
        const newPhotos = [...additionalPhotos, uri];
        await SecureStore.setItemAsync(
          ADDITIONAL_PHOTOS_KEY,
          JSON.stringify(newPhotos),
        );
        setAdditionalPhotos(newPhotos);
        return true;
      } catch (error) {
        console.error("Error adding photo:", error);
        throw error;
      }
    },
    [additionalPhotos],
  );

  // Remove a photo from additional photos by index
  const removePhoto = useCallback(
    async (index: number): Promise<void> => {
      try {
        const newPhotos = additionalPhotos.filter((_, i) => i !== index);
        await SecureStore.setItemAsync(
          ADDITIONAL_PHOTOS_KEY,
          JSON.stringify(newPhotos),
        );
        setAdditionalPhotos(newPhotos);
      } catch (error) {
        console.error("Error removing photo:", error);
        throw error;
      }
    },
    [additionalPhotos],
  );

  // Calculate completion percentage based on filled fields
  const completionPercentage = React.useMemo(() => {
    const requiredFields: (keyof ProfileDto)[] = [
      "fullName",
      "gender",
      "dateOfBirth",
      "height",
      "city",
      "religion",
      "community",
      "highestEducation",
      "occupation",
      "fatherOccupation",
      "familyType",
      "eatingHabits",
    ];

    const filledCount = requiredFields.filter(
      (field) => profileData[field] !== undefined && profileData[field] !== "",
    ).length;

    // Also count profile image and at least one additional photo
    let bonus = 0;
    if (profileImage) bonus += 0.5;
    if (additionalPhotos.length > 0) bonus += 0.5;

    const basePercentage = (filledCount / requiredFields.length) * 100;
    return Math.min(100, Math.round(basePercentage + bonus * 8));
  }, [profileData, profileImage, additionalPhotos]);

  const isProfileComplete = completionPercentage >= 100;

  // Update settings and persist to backend + local storage
  const updateSettings = useCallback(
    async (key: keyof SettingsState, value: boolean) => {
      setIsSavingSettings(true);
      try {
        const newSettings = { ...settings, [key]: value };

        // Persist to local storage immediately for responsiveness
        await SecureStore.setItemAsync(
          SETTINGS_KEY,
          JSON.stringify(newSettings),
        );
        setSettings(newSettings);

        // TODO: When backend endpoint is ready, sync settings here
        // await profileService.updateSettings(newSettings);
      } catch (error) {
        console.error("Error saving settings:", error);
        throw error;
      } finally {
        setIsSavingSettings(false);
      }
    },
    [settings],
  );

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        updateProfileData,
        resetProfileData,
        clearAllUserData,
        profileImage,
        setProfileImage,
        additionalPhotos,
        addPhoto,
        removePhoto,
        isProfileComplete,
        completionPercentage,
        settings,
        updateSettings,
        isLoading,
        isSavingSettings,
        refreshProfile: loadStoredData, // Expose for Login page
      }}
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
