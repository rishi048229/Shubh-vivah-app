import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox, View, Text } from "react-native";

// Suppress red LogBox popups for network & STOMP issues
LogBox.ignoreLogs([
  "AxiosError",
  "Network Error",
  "[STOMP]",
  "Failed to search profiles",
  "Search profiles issue",
  "WebSocket",
]);

import { AuthProvider } from "@/context/AuthContext";
import { ProfileFormProvider } from "@/context/ProfileFormContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { GlobalNotificationToast } from "@/components/GlobalNotificationToast";



export const unstable_settings = {
  initialRouteName: "(auth)/landing",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  console.log("RootLayout: loaded =", loaded, "error =", error);

  useEffect(() => {
    if (error) {
      console.warn("Font loading error:", error);
      // Even on error, we should hide the splash screen to show the error
      SplashScreen.hideAsync();
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log("RootLayout: Fonts loaded, hiding splash screen");
      SplashScreen.hideAsync();
    } else {
      // Emergency unhide, to prevent being stuck forever.
      const timer = setTimeout(() => {
        console.warn("Fonts still not loaded after 3 seconds, forcing splash screen to hide.");
        SplashScreen.hideAsync();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  // If not loaded, we still want to render, but maybe the components using Outfit will error.
  // Rendering null keeps the screen blank (which acts as an infinite splash screen if hideAsync isn't called).
  // Still returning null is fine AFTER we called hideAsync, we will just see a blank white screen.
  // We'll temporarily return the Rest of the app to see the error.
  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}><Text>Loading Fonts...</Text></View>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <AuthProvider>
            <ProfileFormProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                  <Stack
                    initialRouteName="(auth)/landing"
                    screenOptions={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  >
                    {/* Only screens that need custom overrides not met by screenOptions should be defined explicitly */}
                    <Stack.Screen
                      name="profile/[id]"
                      options={{
                        headerShown: false,
                        presentation: "transparentModal",
                        animation: "fade",
                      }}
                    />
                  </Stack>
                <GlobalNotificationToast />
                <StatusBar style="auto" />
              </ThemeProvider>
            </ProfileFormProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
