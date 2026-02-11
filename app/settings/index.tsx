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
    View
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    router.replace("/(auth)/login" as any);
  };

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
          <SettingItem label="Notifications" onPress={() => {}} />
          <SettingItem label="Privacy & Security" onPress={() => {}} />
          <SettingItem label="Match Preferences" onPress={() => {}} />
          <SettingItem label="App Settings" onPress={() => {}} />
          <SettingItem label="Help & Support" onPress={() => {}} />
          <SettingItem label="Legal" onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Profile Helper at Bottom */}
        <View style={styles.bottomProfileContainer}>
          <View style={styles.profileIconContainer}>
            <Ionicons
              name="person-circle-outline"
              size={40}
              color={Colors.maroon}
            />
            <Text style={styles.profileText}>Profile</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{label}</Text>
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
  menuText: {
    fontSize: 16,
    fontWeight: "600",
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
    marginBottom: 40,
  },
  logoutText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomProfileContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  profileIconContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileText: {
    fontSize: 10,
    color: Colors.maroon,
    fontWeight: "bold",
  },
});
