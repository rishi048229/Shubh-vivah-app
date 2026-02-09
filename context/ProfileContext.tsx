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

interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface ProfileContextType {
  // Profile Data
  profileData: Partial<ProfileDto>;
  updateProfileData: (data: Partial<ProfileDto>) => void;
  resetProfileData: () => void;
  clearAllUserData: () => Promise<void>;

  // Location
  location: LocationData | null;
  setLocation: (location: LocationData) => Promise<void>;

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
const LOCATION_KEY = "user_location";
const MAX_ADDITIONAL_PHOTOS = 5;

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Partial<ProfileDto>>({});
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load stored data (exposed as refreshProfile)
  const loadStoredData = useCallback(async () => {
    console.log("🔄 ProfileContext: Starting loadStoredData...");
    try {
      // 1. Check for Auth Token FIRST
      console.log("🔍 ProfileContext: Checking auth_token...");
      const token = await SecureStore.getItemAsync("auth_token");
      console.log("🔍 ProfileContext: Token found?", !!token);

      if (!token) {
        console.log("❌ ProfileContext: No token, stopping load.");
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

      // 5. Load location from secure store
      const storedLocation = await SecureStore.getItemAsync(LOCATION_KEY);
      if (storedLocation) {
        setLocationState(JSON.parse(storedLocation));
      }

      // 6. Load LOCAL profile data first (to restore draft)
      console.log("🔍 ProfileContext: Loading local draft...");
      const storedProfileData =
        await SecureStore.getItemAsync(PROFILE_DATA_KEY);
      if (storedProfileData) {
        setProfileData(JSON.parse(storedProfileData));
      }

      // 7. Load profile data from backend (overwrites local if successful)
      try {
        console.log("🌍 ProfileContext: Fetching profile from backend...");
        const profile = await profileService.getProfile();
        console.log("✅ ProfileContext: Backend profile fetched successfully.");
        if (profile && Object.keys(profile).length > 0) {
          setProfileData(profile);
          await SecureStore.setItemAsync(
            PROFILE_DATA_KEY,
            JSON.stringify(profile),
          );

          // Sync Profile Image from Backend to Local State
          if (profile.profileImageUrl) {
            setProfileImageState(profile.profileImageUrl);
            await SecureStore.setItemAsync(
              PROFILE_IMAGE_KEY,
              profile.profileImageUrl,
            );
          }

          // Sync Location from Backend to Local State
          if (profile.city && profile.latitude && profile.longitude) {
            const backendLocation: LocationData = {
              city: profile.city,
              state: profile.state || "",
              country: profile.country || "India",
              latitude: profile.latitude,
              longitude: profile.longitude,
            };
            setLocationState(backendLocation);
            await SecureStore.setItemAsync(
              LOCATION_KEY,
              JSON.stringify(backendLocation),
            );
          }
        }
      } catch (err) {
        console.log(
          "⚠️ ProfileContext: Backend fetch failed, using local draft.",
          err,
        );
      }
    } catch (error) {
      console.error("❌ ProfileContext: Error loading stored data:", error);
    } finally {
      console.log("🏁 ProfileContext: loadStoredData completed.");
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
      await SecureStore.deleteItemAsync("auth_token"); // Clear Token
      await SecureStore.deleteItemAsync(PROFILE_DATA_KEY); // Clear Profile Draft
      await SecureStore.deleteItemAsync(PROFILE_IMAGE_KEY);
      await SecureStore.deleteItemAsync(ADDITIONAL_PHOTOS_KEY);
      await SecureStore.deleteItemAsync(SETTINGS_KEY);
      await SecureStore.deleteItemAsync(LOCATION_KEY);

      setProfileData({});
      setProfileImageState(null);
      setAdditionalPhotos([]);
      setLocationState(null);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }, []);

  // Set location and persist to backend + local storage
  const setLocation = useCallback(
    async (locationData: LocationData) => {
      try {
        console.log("📍 Saving location:", locationData);

        // 1. Update local state
        setLocationState(locationData);

        // 2. Save to SecureStore for offline access
        await SecureStore.setItemAsync(
          LOCATION_KEY,
          JSON.stringify(locationData),
        );

        // 3. Prepare location fields
        const locationFields: Partial<ProfileDto> = {
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };

        // 4. Merge with existing profile data for backend save
        const mergedData = { ...profileData, ...locationFields };

        // 5. Update local profileData state
        setProfileData((prev) => {
          const newData = { ...prev, ...locationFields };
          SecureStore.setItemAsync(
            PROFILE_DATA_KEY,
            JSON.stringify(newData),
          ).catch((err) => console.error("Failed to save profile draft", err));
          return newData;
        });

        // 6. Persist to backend with merged data
        try {
          await profileService.saveOrUpdateProfile(mergedData);
          console.log("✅ Location saved to backend");
        } catch (backendError) {
          console.error("❌ Backend save failed:", backendError);
          console.log(
            "💾 Location saved locally, will sync when backend is available",
          );
          // Location is still saved locally, just not synced to backend yet
        }
      } catch (error) {
        console.error("❌ Error saving location:", error);
        throw error;
      }
    },
    [profileData],
  );

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
        location,
        setLocation,
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
