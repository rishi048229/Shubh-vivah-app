import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface HomeSearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTION_CHIPS = [
  "Marathi",
  "Pune",
  "Engineer",
  "Doctor",
  "Mumbai",
  "USA",
  "30-35",
];

export default function HomeSearchOverlay({
  visible,
  onClose,
}: HomeSearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Search matches..."
            autoFocus
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <View style={styles.recentList}>
          {["Priya", "Doctor in Pune", "Software Engineer"].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.recentItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trending</Text>
        <View style={styles.chipsContainer}>
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <TouchableOpacity key={idx} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF",
    zIndex: 100, // Topmost level
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 12,
  },
  recentList: {
    gap: 16,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentText: {
    fontSize: 16,
    color: "#333",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "500",
  },
});
