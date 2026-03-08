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

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Effective Date: May 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using Shubh Vivah, you accept and agree to be bound by the terms and provisions of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>2. User Conduct</Text>
          <Text style={styles.text}>
            Users agree to use our services only for lawful purposes. You must not use our platform to transmit any material that is offensive, defamatory, or infringes on the rights of others.
          </Text>

          <Text style={styles.sectionTitle}>3. Account Registration</Text>
          <Text style={styles.text}>
            To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account information.
          </Text>

          <Text style={styles.sectionTitle}>4. Termination</Text>
          <Text style={styles.text}>
            We reserve the right to terminate or suspend access to our application immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </Text>

          <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </Text>
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
  lastUpdated: { fontSize: 14, color: "#6B7280", marginBottom: 24, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginTop: 16, marginBottom: 8 },
  text: { fontSize: 15, color: "#4B5563", lineHeight: 24, marginBottom: 16 }
});
