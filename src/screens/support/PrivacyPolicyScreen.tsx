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

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: May 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to Shubh Vivah. We prioritize your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application.
          </Text>

          <Text style={styles.sectionTitle}>2. The Data We Collect</Text>
          <Text style={styles.text}>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            {"\n"}• Identity Data
            {"\n"}• Contact Data
            {"\n"}• Profile Data
            {"\n"}• Usage Data
          </Text>

          <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
          <Text style={styles.text}>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide our matchmaking services, to manage your account, and to improve our application.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
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
