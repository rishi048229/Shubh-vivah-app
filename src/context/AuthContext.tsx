import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { connectWebSocket, disconnectWebSocket } from "@/services/chatService";

interface AuthContextType {
  user: { id: number; token: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userId?: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: SecureStore doesn't work on web, use localStorage fallback
const tokenStore = {
  get: async (): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem("auth_token");
    }
    return SecureStore.getItemAsync("auth_token");
  },
  set: async (token: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.setItem("auth_token", token);
      return;
    }
    await SecureStore.setItemAsync("auth_token", token);
  },
  remove: async (): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.removeItem("auth_token");
      return;
    }
    await SecureStore.deleteItemAsync("auth_token");
  },
  getUserId: async (): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem("user_id");
    }
    return SecureStore.getItemAsync("user_id");
  },
  setUserId: async (id: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.setItem("user_id", id);
      return;
    }
    await SecureStore.setItemAsync("user_id", id);
  },
  removeUserId: async (): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.removeItem("user_id");
      return;
    }
    await SecureStore.deleteItemAsync("user_id");
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: number; token: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app launch
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await tokenStore.get();
        const userId = await tokenStore.getUserId();
        if (token && userId) {
          setUser({ id: parseInt(userId, 10), token });
          connectWebSocket().catch((err) => console.log("WebSocket connect error on load:", err));
        }
      } catch (e) {
        console.log("Auth check failed:", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (token: string, userId?: number) => {
    await tokenStore.set(token);
    if (userId !== undefined) {
      await tokenStore.setUserId(String(userId));
    }
    setUser({ id: userId ?? 0, token });
    connectWebSocket().catch((err) => console.log("WebSocket connect error on login:", err));
  };

  const logout = async () => {
    await tokenStore.remove();
    await tokenStore.removeUserId();
    setUser(null);
    disconnectWebSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user?.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
