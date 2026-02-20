import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function ConnectionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.ivory },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="explore-all/index" />
    </Stack>
  );
}
