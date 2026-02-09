import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ProfileProvider } from "@/context/ProfileContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent splash from auto-hiding immediately
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Hide splash screen after a short delay (failsafe)
  useEffect(() => {
    console.log("RootLayout mounted");
    const hideSplash = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        await SplashScreen.hideAsync();
        console.log("SplashScreen hidden");
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    };
    hideSplash();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName="login">
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen
              name="forgot-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="complete-profile"
              options={{ headerShown: false, title: "Complete Profile" }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}
