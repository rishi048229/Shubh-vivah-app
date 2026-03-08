import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: any) => {
    router.push(path);
  };

  const getIconColor = (path: string) => {
    return pathname === path ? Colors.maroon : "#333";
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=11" }} // Placeholder
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.uid}>UID: SV12345</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <DrawerItem
            label="Home"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="home-outline" size={size} color={getIconColor("/(tabs)")} />}
            onPress={() => navigateTo("/(tabs)")}
          />
          <DrawerItem
            label="Explore"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="compass-outline" size={size} color={getIconColor("/(tabs)/connections")} />}
            onPress={() => navigateTo("/(tabs)/connections")}
          />
          <DrawerItem
            label="Messages"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="chatbubbles-outline" size={size} color={getIconColor("/(tabs)/chat")} />}
            onPress={() => navigateTo("/(tabs)/chat")}
          />
          <DrawerItem
            label="Notifications"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="notifications-outline" size={size} color={getIconColor("/routes/notifications")} />}
            onPress={() => navigateTo("/routes/notifications")}
          />
          <DrawerItem
            label="Activity Center"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="flash-outline" size={size} color={getIconColor("/(tabs)/service")} />}
            onPress={() => navigateTo("/(tabs)/service")}
          />
          <DrawerItem
            label="Profile"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="person-outline" size={size} color={getIconColor("/profile")} />}
            onPress={() => navigateTo("/profile")}
          />
          <DrawerItem
            label="Settings"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="settings-outline" size={size} color={getIconColor("/settings")} />}
            onPress={() => navigateTo("/settings")}
          />
          <DrawerItem
            label="Help & Support"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Ionicons name="help-circle-outline" size={size} color={getIconColor("/support/help")} />}
            onPress={() => navigateTo("/support/help")}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/(auth)/login" as any)}>
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  scrollContent: {
    paddingTop: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D1406",
  },
  uid: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  menuContainer: {
    paddingHorizontal: 10,
  },
  drawerLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: -10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "600",
    marginLeft: 15,
  },
});
