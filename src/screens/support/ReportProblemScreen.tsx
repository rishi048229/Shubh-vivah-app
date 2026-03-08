import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";

export default function ReportProblemScreen() {
  const router = useRouter();
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // In a real app, send api request
    alert("Thank you for your report. We will look into it shortly.");
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a Problem</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>What's going wrong?</Text>
          <Text style={styles.text}>
            Please describe the issue you're experiencing in detail so our team can investigate and fix it.
          </Text>

          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Type your description here..."
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={!description.trim()}>
            <Text style={styles.submitBtnText}>Submit Report</Text>
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
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  text: { fontSize: 15, color: "#6B7280", marginBottom: 24, lineHeight: 22 },
  textInput: { backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, fontSize: 16, color: "#111827", minHeight: 150, marginBottom: 30 },
  submitBtn: { backgroundColor: Colors.maroon, padding: 16, borderRadius: 12, alignItems: "center" },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" }
});
