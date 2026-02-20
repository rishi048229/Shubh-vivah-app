import { Stack } from "expo-router";

export default function CompleteProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="terms" />
      <Stack.Screen name="select-gender" />
      <Stack.Screen name="basic-details" />
      <Stack.Screen name="religious-details" />
      <Stack.Screen name="education-career" />
      <Stack.Screen name="family-details" />
      <Stack.Screen name="lifestyle-habits" />
      <Stack.Screen name="profile-completed" />
    </Stack>
  );
}
