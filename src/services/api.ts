import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

/**
 * Determine the correct base URL for the backend server.
 * - Extracts Expo Go host IP dynamically for physical devices.
 * - Falls back to Android emulator (10.0.2.2) or iOS/Web (localhost).
 */
const getBaseUrl = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  // If running in Expo Go (physical or emulator), dynamically get the host IP
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:8085`; // Backend runs on 8085
  }

  // If emulator or web, fallback to standard local proxies
  if (Platform.OS === "android") {
    // Android emulator -> host machine
    return "http://10.0.2.2:8085";
  }
  // iOS simulator / web
  return "http://localhost:8085";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token from SecureStore
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // SecureStore might fail on web — ignore silently
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear stored token on 401 or 403 (expired token fallback)
      try {
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("user_id");
      } catch (_) {}
    }
    return Promise.reject(error);
  },
);

export default api;
