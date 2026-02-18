import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  userId: number | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Decode userId from JWT payload (base64-encoded JSON with "sub" field)
 */
function decodeUserId(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.sub ? parseInt(parsed.sub, 10) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  // On mount, check for stored token
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("auth_token");
        if (storedToken && isMounted) {
          // Optional: Verify token validity here if needed (e.g. check exp)
          setToken(storedToken);
          setUserId(decodeUserId(storedToken));
        }
      } catch (e) {
        console.log("Auth load error:", e);
        // SecureStore might fail on web or if corrupted
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Use a small timeout to ensure navigation container is ready
    const timeoutId = setTimeout(() => {
      if (!token && !inAuthGroup) {
        // Not logged in, redirect to landing
        router.replace("/(auth)/landing" as any);
      } else if (token && inAuthGroup) {
        // Logged in but on auth screen, redirect to tabs
        router.replace("/(tabs)" as any);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [token, segments, isLoading]);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync("auth_token", newToken);
    setToken(newToken);
    setUserId(decodeUserId(newToken));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isLoggedIn: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
