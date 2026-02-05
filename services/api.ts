import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORTANT: For physical devices, use your computer's network IP
// For Android Emulator, use 10.0.2.2
// For iOS Simulator, use localhost
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_IP = "192.168.1.18"; // <-- UPDATE THIS to your computer's IP

const BASE_URL = `http://${LOCAL_IP}:8082`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
