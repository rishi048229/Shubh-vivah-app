import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.navRow}>
            <Text style={styles.rowText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+1 234 567 8900" keyboardType="phone-pad" />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="john@example.com" keyboardType="email-address" />
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  inputCard: { backgroundColor: "#FFF", padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  input: { fontSize: 16, color: "#111827", paddingVertical: 4 },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  rowText: { fontSize: 16, color: "#111827" },
  saveBtn: { backgroundColor: Colors.maroon, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 30, marginBottom: 40 },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" }
});
