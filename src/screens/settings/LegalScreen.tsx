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
} from "react-native";

export default function LegalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Policies</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.navRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="document-text-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.navRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.navRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.maroon} style={styles.icon} />
                <Text style={styles.rowText}>Cookie Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Licensing</Text>
          <TouchableOpacity style={[styles.navRow, styles.standaloneRow]}>
            <View style={styles.rowLeft}>
              <Ionicons name="code-slash-outline" size={20} color={Colors.maroon} style={styles.icon} />
              <Text style={styles.rowText}>Open Source Licenses</Text>
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
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 12 },
  rowText: { fontSize: 16, color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginLeft: 48 },
  standaloneRow: { backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
});
