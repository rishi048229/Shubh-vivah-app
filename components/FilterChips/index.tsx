import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES = [
  { label: "Recommended", count: 12 },
  { label: "New Matches", count: 5 },
  { label: "Nearby", count: 3 },
  { label: "Premium", count: 8 },
  { label: "Shortlisted", count: 2 },
];

export default function FilterChips() {
  const router = useRouter();
  const [selected, setSelected] = React.useState("Recommended");

  const handlePress = (category: string) => {
    setSelected(category);
    if (category === "New Matches") {
      router.push("/new-matches");
    } else if (category === "Nearby") {
      router.push("/nearby");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.label;
          return (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.chip,
                isSelected ? styles.selectedChip : styles.unselectedChip,
              ]}
              onPress={() => handlePress(cat.label)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.text,
                  isSelected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {cat.label}
              </Text>
              {cat.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected ? styles.selectedCount : styles.unselectedCount,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected ? styles.selectedText : styles.unselectedText,
                    ]}
                  >
                    {cat.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4, // Specify padding for Shadow
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 8,
  },
  selectedChip: {
    backgroundColor: "#C21807", // Red
  },
  unselectedChip: {
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedText: {
    color: "#FFF",
  },
  unselectedText: {
    color: "#2D1406",
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedCount: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  unselectedCount: {
    backgroundColor: "#F0E6D2",
  },
  countText: {
    fontSize: 11,
    fontWeight: "bold",
  },
});
