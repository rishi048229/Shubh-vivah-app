import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export const SettingsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Settings & Controls</Text>

      <View style={styles.card}>
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          type="toggle"
          value={true}
        />
        <View style={styles.divider} />
        <SettingItem
          icon="eye-outline"
          label="Profile Visibility"
          type="toggle"
          value={true}
        />
        <View style={styles.divider} />
        <SettingItem
          icon="lock-closed-outline"
          label="Privacy Controls"
          type="link"
        />
        <View style={styles.divider} />
        <SettingItem icon="ban-outline" label="Blocked Users" type="link" />
        <View style={styles.divider} />
        <SettingItem
          icon="log-out-outline"
          label="Logout"
          type="link"
          isDestructive
        />
      </View>
    </View>
  );
};

const SettingItem = ({
  icon,
  label,
  type,
  value,
  isDestructive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  type: "toggle" | "link";
  value?: boolean;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity style={styles.item} disabled={type === "toggle"}>
    <View style={styles.itemLeft}>
      <View
        style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#FF4444" : Colors.light.maroon}
        />
      </View>
      <Text style={[styles.label, isDestructive && styles.destructiveLabel]}>
        {label}
      </Text>
    </View>
    {type === "toggle" ? (
      <Switch
        value={value}
        trackColor={{ false: "#E0E0E0", true: Colors.light.maroon }}
        thumbColor={"#FFF"}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120, // Space for bottom nav
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
  },
  destructiveIconBox: {
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  destructiveLabel: {
    color: "#FF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginLeft: 63, // Align with text
  },
});
