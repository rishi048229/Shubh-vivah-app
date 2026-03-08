import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import { usePathname } from "expo-router";
import { Dimensions } from "react-native";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

export default function DrawerNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Disable drawer on Auth screens
  const isAuthScreen =
    pathname.startsWith("/landing") ||
    pathname.startsWith("/login") ||
    pathname.includes("register") ||
    pathname.includes("language");

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        swipeEnabled: !isAuthScreen,
        drawerStyle: {
          width: width * 0.75,
        },
      }}
    >
      <Drawer.Screen name="MainApp">
        {() => <>{children}</>}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
