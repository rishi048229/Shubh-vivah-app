import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Android emulator uses 10.0.2.2 to reach host localhost
// Physical device: replace with your machine's LAN IP

const getBaseUrl = () => {
  // If running on a physical device, get the host IP from Expo config
  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    const ip = hostUri.split(":")[0];
    const url = `http://${ip}:9090`;
    console.log("Debug: Computed API URL:", url);
    return url;
  }

  // Fallback for emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:9090";
  }

  // Fallback for web or if hostUri is missing (e.g. production build)
  return "http://localhost:9090";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // SecureStore might fail on web
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      console.log("Network Error - check API URL:", api.defaults.baseURL);
    }
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync("auth_token");
      } catch (e) {}
    }
    return Promise.reject(error);
  },
);

export default api;
