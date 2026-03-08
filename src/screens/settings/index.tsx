import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteAccount } from "@/services/settingsService";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    router.replace("/(auth)/login" as any);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      router.replace("/(auth)/login" as any);
    } catch(err) {
       console.error("Failed to delete account", err);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          <SettingItem label="Account" icon="person-outline" onPress={() => router.push("/settings/account")} />
          <SettingItem label="Preferences" icon="options-outline" onPress={() => router.push("/settings/preferences")} />
          <SettingItem label="Notifications" icon="notifications-outline" onPress={() => router.push("/settings/notifications")} />
          <SettingItem label="Privacy" icon="lock-closed-outline" onPress={() => router.push("/settings/privacy")} />
          <SettingItem label="Blocked Users" icon="close-circle-outline" onPress={() => router.push("/settings/blocked" as any)} />
          <SettingItem label="Support" icon="help-buoy-outline" onPress={() => router.push("/settings/support")} />
          <SettingItem label="Legal" icon="document-text-outline" onPress={() => router.push("/settings/legal")} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={20} color={Colors.maroon} style={styles.menuIcon} />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#333" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D1406",
  },
  placeholder: {
    width: 34,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuContainer: {
    gap: 15,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.maroon,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.maroon,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: Colors.maroon,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    marginTop: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D32F2F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  deleteText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
  },
});
