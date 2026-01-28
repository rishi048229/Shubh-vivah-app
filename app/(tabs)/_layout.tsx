import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { FloatingBottomNav } from "@/components/FloatingBottomNav";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingBottomNav {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null, // Remove default background
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Transparent background on iOS
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // @ts-ignore: Custom option for FloatingBottomNav
          tabBarIconName: "home",
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          // @ts-ignore: Custom option for FloatingBottomNav
          tabBarIconName: "grid",
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          // @ts-ignore: Custom option for FloatingBottomNav
          tabBarIconName: "gift",
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          // @ts-ignore: Custom option for FloatingBottomNav
          tabBarIconName: "calendar",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          // @ts-ignore: Custom option for FloatingBottomNav
          tabBarIconName: "person",
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      /> */}
    </Tabs>
  );
}
