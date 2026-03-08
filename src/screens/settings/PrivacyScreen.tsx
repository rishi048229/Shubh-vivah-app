import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  ActivityIndicator
} from "react-native";
import { getSettings, updateSettings, UserSettings } from "@/services/settingsService";

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e) {
      setSettings({
        showOnlineStatus: false,
        showLastSeen: false,
        showDistance: true,
        profileVisible: true,
        photosRequireConnection: true,
        notifyNewMessage: true,
        notifyConnectionRequest: true,
        notifyConnectionAccepted: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await updateSettings(newSettings);
    } catch (e) {}
  };

  if (loading || !settings) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.maroon} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="eye-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Profile Visible</Text>
              </View>
              <Switch 
                value={settings.profileVisible} 
                onValueChange={(val) => handleUpdate("profileVisible", val)}
                trackColor={{ false: "#E5E7EB", true: Colors.maroon }}
                thumbColor="#FFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="location-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Show Distance</Text>
              </View>
              <Switch 
                value={settings.showDistance} 
                onValueChange={(val) => handleUpdate("showDistance", val)}
                trackColor={{ false: "#E5E7EB", true: Colors.maroon }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="radio-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Online Status</Text>
              </View>
              <Switch 
                value={settings.showOnlineStatus} 
                onValueChange={(val) => handleUpdate("showOnlineStatus", val)}
                trackColor={{ false: "#E5E7EB", true: Colors.maroon }}
                thumbColor="#FFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="time-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Last Seen</Text>
              </View>
              <Switch 
                value={settings.showLastSeen} 
                onValueChange={(val) => handleUpdate("showLastSeen", val)}
                trackColor={{ false: "#E5E7EB", true: Colors.maroon }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blocked Users</Text>
          <TouchableOpacity style={styles.navRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="ban-outline" size={20} color={Colors.maroon} style={styles.icon} />
              <Text style={styles.rowText}>Manage Blocked Users</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.ivory },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#2D1406" },
  placeholder: { width: 34 },
  container: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2D1406", marginBottom: 12 },
  card: { backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", overflow: "hidden" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 12 },
  rowText: { fontSize: 16, color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginLeft: 48 },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
});
