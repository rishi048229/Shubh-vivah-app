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

export default function PreferencesScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e) {
      console.log("Error loading settings:", e);
      // fallback
      setSettings({
        showOnlineStatus: true,
        showLastSeen: true,
        showDistance: true,
        profileVisible: true,
        photosRequireConnection: false,
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
      setSaving(true);
      await updateSettings(newSettings);
    } catch (e) {
      console.log("Failed to update setting", e);
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>Match Preferences</Text>
        <View style={styles.placeholder}>
          {saving && <ActivityIndicator size="small" color={Colors.maroon} />}
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Criteria</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowText}>Age Range</Text>
              <Text style={styles.valueText}>{settings.minAge || 21} - {settings.maxAge || 35}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowText}>Maximum Distance</Text>
              <Text style={styles.valueText}>{settings.maxDistanceKm || 50} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.rowSelect}>
              <Text style={styles.rowText}>Religion</Text>
              <View style={styles.selectRight}>
                <Text style={styles.valueText}>{(settings.religions && settings.religions.length > 0) ? settings.religions.join(", ") : "Any"}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.rowSelect}>
              <Text style={styles.rowText}>Community</Text>
              <View style={styles.selectRight}>
                <Text style={styles.valueText}>{(settings.communities && settings.communities.length > 0) ? settings.communities.join(", ") : "Any"}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.rowSelect}>
              <Text style={styles.rowText}>Education Level</Text>
              <View style={styles.selectRight}>
                <Text style={styles.valueText}>Any</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.rowSelect}>
              <Text style={styles.rowText}>Profession</Text>
              <View style={styles.selectRight}>
                <Text style={styles.valueText}>Any</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 40 }} />
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
  rowSelect: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  selectRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowText: { fontSize: 16, color: "#111827" },
  valueText: { fontSize: 16, color: "#6B7280" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginLeft: 16 },
});
