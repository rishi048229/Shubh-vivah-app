import * as Location from "expo-location";
import api from "./api";

export type UserLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  synced?: boolean;
};

// --- API Calls ---

const updateBackendLocation = async (
  lat: number,
  lng: number,
  city?: string,
): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates:", lat, lng);
      return false;
    }

    params.append("lat", String(lat));
    params.append("lng", String(lng));
    if (city) {
      params.append("city", city);
    }

    await api.put(`/profile/location?${params.toString()}`);
    console.log("Location updated in backend:", { lat, lng, city });
    return true;
  } catch (error) {
    console.error("Failed to update location in backend", error);
    return false;
  }
};

// --- Service Methods ---

export const requestLocationPermission = async (): Promise<boolean> => {
  console.log("Requesting permissions...");
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log("Permission status:", status);
  return status === "granted";
};

export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    // Check if location services are enabled
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      console.log("Location services are disabled");
      return null;
    }

    let location;
    try {
      // Try to get current position (removed invalid timeout property)
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch (e) {
      console.log("getCurrentPositionAsync failed, trying last known...", e);
      location = await Location.getLastKnownPositionAsync();
    }

    if (!location) {
      console.log("No location could be determined.");
      return null;
    }

    const { latitude, longitude } = location.coords;
    let city: string | undefined;
    let region: string | undefined;

    // Reverse Geocoding
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        console.log("Full Address Object:", JSON.stringify(address, null, 2)); // DEBUG LOG

        const cityName = address.city || address.subregion;
        const areaName = address.district || address.street || address.name;

        // Construct detailed location: "Area, City"
        if (cityName && areaName && areaName !== cityName) {
          city = `${areaName}, ${cityName}`;
        } else {
          city = cityName || undefined;
        }

        region = address.region || undefined;
      }
    } catch (e) {
      console.log("Reverse geocoding failed", e);
    }

    // Update Backend
    const synced = await updateBackendLocation(latitude, longitude, city);

    return { latitude, longitude, city, region, synced };
  } catch (error) {
    console.error("Error getting location", error);
    return null;
  }
};
