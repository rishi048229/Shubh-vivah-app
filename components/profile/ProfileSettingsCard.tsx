import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, SlideInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ProfileSettingsCard = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, isSavingSettings, clearAllUserData } =
    useProfile();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const handleToggle = async (
    key: keyof typeof settings,
    currentValue: boolean,
  ) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateSettings(key, !currentValue);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearAllUserData();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleAccountSettings = () => {
    Alert.alert("Account Settings", "Manage your account preferences", [
      {
        text: "Change Password",
        onPress: () => console.log("Change Password"),
      },
      {
        text: "Delete Account",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            "Delete Account",
            "Contact support to delete your account.",
          ),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleMatchPreferences = () => {
    // Navigate to match preferences or show modal
    Alert.alert(
      "Match Preferences",
      "Feature coming soon! You'll be able to set age range, location, religion preferences here.",
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(600)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons
          name="settings-outline"
          size={18}
          color={Colors.light.maroon}
        />
        <Text style={styles.title}>Settings & Controls</Text>
        {isSavingSettings && (
          <ActivityIndicator
            size="small"
            color={Colors.light.maroon}
            style={styles.loader}
          />
        )}
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingToggle
          icon="notifications-outline"
          label="Push Notifications"
          value={settings.notificationsEnabled}
          onToggle={() =>
            handleToggle("notificationsEnabled", settings.notificationsEnabled)
          }
        />
        <SettingToggle
          icon="heart-outline"
          label="Match Notifications"
          value={settings.matchNotifications}
          onToggle={() =>
            handleToggle("matchNotifications", settings.matchNotifications)
          }
        />
        <SettingToggle
          icon="chatbubble-outline"
          label="Message Notifications"
          value={settings.messageNotifications}
          onToggle={() =>
            handleToggle("messageNotifications", settings.messageNotifications)
          }
        />
        <SettingToggle
          icon="star-outline"
          label="Horoscope Alerts"
          value={settings.horoscopeAlerts}
          onToggle={() =>
            handleToggle("horoscopeAlerts", settings.horoscopeAlerts)
          }
        />
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingToggle
          icon="eye-outline"
          label="Profile Visibility"
          value={settings.profileVisibility}
          onToggle={() =>
            handleToggle("profileVisibility", settings.profileVisibility)
          }
        />
        <SettingLink
          icon="lock-closed-outline"
          label="Privacy Controls"
          onPress={() => setShowPrivacyModal(true)}
        />
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingLink
          icon="ban-outline"
          label="Blocked Users"
          onPress={() => setShowBlockedModal(true)}
        />
        <SettingLink
          icon="options-outline"
          label="Match Preferences"
          onPress={handleMatchPreferences}
        />
        <SettingLink
          icon="person-outline"
          label="Account Settings"
          onPress={handleAccountSettings}
        />
        <SettingLink
          icon="log-out-outline"
          label="Logout"
          isDestructive
          onPress={handleLogout}
        />
      </View>

      {/* Privacy Controls Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInUp.duration(300)}
            style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Controls</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.privacyItem}>
                <Ionicons
                  name="eye-off-outline"
                  size={20}
                  color={Colors.light.maroon}
                />
                <View style={styles.privacyText}>
                  <Text style={styles.privacyLabel}>Hide from Search</Text>
                  <Text style={styles.privacyDesc}>
                    Your profile won't appear in search results
                  </Text>
                </View>
                <Switch
                  value={false}
                  trackColor={{ true: Colors.light.maroon }}
                />
              </View>
              <View style={styles.privacyItem}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={Colors.light.maroon}
                />
                <View style={styles.privacyText}>
                  <Text style={styles.privacyLabel}>Hide Contact Info</Text>
                  <Text style={styles.privacyDesc}>
                    Only show phone after mutual match
                  </Text>
                </View>
                <Switch
                  value={true}
                  trackColor={{ true: Colors.light.maroon }}
                />
              </View>
              <View style={styles.privacyItem}>
                <Ionicons
                  name="image-outline"
                  size={20}
                  color={Colors.light.maroon}
                />
                <View style={styles.privacyText}>
                  <Text style={styles.privacyLabel}>Photo Privacy</Text>
                  <Text style={styles.privacyDesc}>
                    Blur photos until connection
                  </Text>
                </View>
                <Switch
                  value={false}
                  trackColor={{ true: Colors.light.maroon }}
                />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Blocked Users Modal */}
      <Modal
        visible={showBlockedModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBlockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInUp.duration(300)}
            style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Blocked Users</Text>
              <TouchableOpacity onPress={() => setShowBlockedModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.emptyState}>
              <Ionicons
                name="shield-checkmark-outline"
                size={48}
                color="#CCC"
              />
              <Text style={styles.emptyTitle}>No Blocked Users</Text>
              <Text style={styles.emptyDesc}>
                Users you block will appear here
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
};

import { NeumorphicToggle } from "../ui/NeumorphicToggle";

const SettingToggle = ({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={18} color={Colors.light.maroon} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <NeumorphicToggle
      isOn={value}
      onToggle={onToggle}
      activeColor={Colors.light.maroon}
      width={50}
      height={28}
    />
  </View>
);

const SettingLink = ({
  icon,
  label,
  onPress,
  isDestructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingLeft}>
      <View
        style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isDestructive ? "#FF4444" : Colors.light.maroon}
        />
      </View>
      <Text
        style={[styles.settingLabel, isDestructive && styles.destructiveLabel]}
      >
        {label}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.maroon,
    flex: 1,
  },
  loader: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.lightMaroon,
    alignItems: "center",
    justifyContent: "center",
  },
  destructiveIconBox: {
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  settingLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  destructiveLabel: {
    color: "#FF4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  privacyText: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  privacyDesc: {
    fontSize: 12,
    color: "#888",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
