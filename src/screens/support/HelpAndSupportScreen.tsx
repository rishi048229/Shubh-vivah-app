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

export default function HelpAndSupportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>How can we help you?</Text>
          <Text style={styles.text}>
            Find answers to common questions or reach out to our team directly.
          </Text>

          <View style={styles.list}>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Frequently Asked Questions (FAQ)</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Account Settings & Profile</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Safety & Security</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Billing & Subscriptions</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
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
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  text: { fontSize: 16, color: "#6B7280", marginBottom: 24, lineHeight: 24 },
  list: { backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", overflow: "hidden", marginBottom: 32 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 16, alignItems: "center" },
  itemText: { fontSize: 16, color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginLeft: 16 },
  contactCard: { backgroundColor: "#F9FAFB", padding: 20, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  contactTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 16 },
  contactButton: { backgroundColor: Colors.maroon, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  contactButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" }
});
