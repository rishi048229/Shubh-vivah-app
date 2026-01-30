import { Tabs } from "expo-router";
import React from "react";

import { CustomBottomNav } from "@/components/CustomBottomNav";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // @ts-ignore
          tabBarIconName: "home",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          // @ts-ignore
          tabBarIconName: "chatbubbles",
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: "Connection",
          // @ts-ignore
          tabBarIconName: "people",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          // @ts-ignore
          tabBarIconName: "person",
        }}
      />

      {/* Hide other screens */}
      <Tabs.Screen
        name="services"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
