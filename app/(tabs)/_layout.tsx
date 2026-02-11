import CustomTabBar from "@/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "index" }} />
      <Tabs.Screen name="connections" options={{ title: "connections" }} />
      <Tabs.Screen name="match" options={{ title: "match" }} />
      <Tabs.Screen name="chat" options={{ title: "chat" }} />
      <Tabs.Screen name="service" options={{ title: "service" }} />
    </Tabs>
  );
}
