import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

// IMPORTANT: For physical devices, use your computer's network IP
// For Android Emulator, use 10.0.2.2
// For iOS Simulator, use localhost
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_IP = "192.168.1.27"; // <-- UPDATE THIS to your computer's IP

const BASE_URL = `http://${LOCAL_IP}:8082`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Token (skip for public test endpoints)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Skip auth for auth endpoints and test endpoints
      const isPublicEndpoint =
        config.url?.includes("/api/test/") || config.url?.startsWith("/auth/");
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url} | Public: ${isPublicEndpoint}`,
      );

      if (!isPublicEndpoint) {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
          console.log("✅ Attaching Token:", token.substring(0, 20) + "...");
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn(
            "⚠️ No token found in SecureStore for protected endpoint!",
          );
        }
      }
    } catch (error) {
      console.error("Error fetching token", error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.error("API Error Status:", error.response?.status);
    console.error("API Error Data:", error.response?.data);

    // Handle Unauthorized or Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        console.warn("Token expired or invalid. Logging out...");
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("user_id");

        Alert.alert("Session Expired", "Please login again.");
        router.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
