import { ProfileProvider } from "@/context/ProfileContext";
import { Stack } from "expo-router";

export default function CompleteProfileLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="basic-details" />
        <Stack.Screen name="religious-details" />
        <Stack.Screen name="education-details" />
        <Stack.Screen name="family-details" />
        <Stack.Screen name="lifestyle-habits" />
        <Stack.Screen name="profile-completed" />
      </Stack>
    </ProfileProvider>
  );
}
