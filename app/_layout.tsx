import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="view-all" options={{ headerShown: false }} />
            <Stack.Screen
              name="new-matches"
              options={{
                headerShown: false,
                animation: "slide_from_right", // Changed to slide from right as requested
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
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
