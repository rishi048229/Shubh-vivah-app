import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

// --- MOCK DATA ---
const MOCK_PROFILE = {
  fullName: "Rishi User",
  gender: "Male",
  dateOfBirth: "1998-05-15",
  height: 175,
  weight: 70,
  city: "Pune",
  religion: "Hindu",
  community: "Maratha",
  caste: "96 Kuli",
  manglikStatus: "No",
  education: "B.Tech",
  occupation: "Software Engineer",
  annualIncome: 1200000,
  aboutMe: "I am a software engineer appearing for a mock backend test.",
  profilePhotoUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  // Missing fields to test completion logic
  dietPreference: null,
  smoking: null,
  drinking: null,
  fatherOccupation: "",
  motherOccupation: "",
  sisters: null,
  familyType: null,
};

const MOCK_MATCH_PROFILE = {
  userId: 101,
  fullName: "Piriya Sharma",
  age: 24,
  city: "Mumbai",
  religion: "Hindu",
  matchScore: 92,
  profilePhotoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  photos: [],
  distanceKm: 120,
  distanceText: "120 km away",
  occupation: "Doctor",
  education: "MBBS",
};

// --- ADAPTER ---
// detailed mock adapter to handle all known endpoints
const mockAdapter = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  const { url, method, data } = config;
  console.log(`[MOCK API] ${method?.toUpperCase()} ${url}`);

  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network lag

  const status = 200;
  let responseData: any = {};

  if (url?.includes("/auth/login")) {
    responseData = {
      token:
        "mock-jwt-token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature",
      email: "test@example.com",
    };
  } else if (
    url?.includes("/auth/send-otp") ||
    url?.includes("/auth/verify-otp")
  ) {
    responseData = "Success";
  } else if (url?.includes("/profile") && method === "get") {
    responseData = MOCK_PROFILE;
  } else if (url?.includes("/matches/explore/next")) {
    responseData = {
      ...MOCK_MATCH_PROFILE,
      userId: Math.floor(Math.random() * 1000),
      matchScore: Math.floor(Math.random() * 20) + 80,
    };
  } else if (url?.includes("/matches/explore/previous")) {
    responseData = MOCK_MATCH_PROFILE;
  } else if (url?.includes("/matches/search")) {
    responseData = [
      MOCK_MATCH_PROFILE,
      { ...MOCK_MATCH_PROFILE, userId: 102, fullName: "Anjali Gupta" },
    ];
  } else {
    // Default success for other posts/puts to avoid blocking
    responseData = { success: true };
  }

  return {
    data: responseData,
    status,
    statusText: "OK",
    headers: {},
    config: config as any,
    request: {},
  };
};

const getBaseUrl = () => {
  return "http://mock-backend";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  adapter: mockAdapter, // <--- DETECTED: ENABLE MOCK ADAPTER
});

// Request interceptor — attach JWT token (keep for realism)
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
    console.log("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;
