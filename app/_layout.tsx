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

import { AuthProvider } from "@/context/AuthContext";
import { ProfileFormProvider } from "@/context/ProfileFormContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "landing",
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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
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
                <Stack initialRouteName="(auth)/landing">
                  <Stack.Screen
                    name="(auth)/landing"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/language-selection"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/login"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/register"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/forgot-password"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="complete-profile"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen
                    name="view-all"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="new-matches"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen
                    name="nearby"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen
                    name="connections/index"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen
                    name="profile/index"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen
                    name="profile/[id]"
                    options={{
                      headerShown: false,
                      presentation: "transparentModal",
                      animation: "fade",
                    }}
                  />
                  <Stack.Screen
                    name="chat/[id]"
                    options={{
                      headerShown: false,
                      animation: "slide_from_right",
                    }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </ProfileFormProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
