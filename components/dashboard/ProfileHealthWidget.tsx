import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeIn
} from "react-native-reanimated";

export const ProfileHealthWidget = () => {
  const router = useRouter();
  const { completionPercentage, isProfileComplete, additionalPhotos } =
    useProfile();

  // Dynamic tip based on what's missing
  const getTip = () => {
    if (completionPercentage < 30)
      return "💡 Start by adding your basic details";
    if (completionPercentage < 50)
      return "💡 Add your education and career info";
    if (completionPercentage < 70) return "💡 Complete your family details";
    if (additionalPhotos.length === 0)
      return "💡 Add photos to get 3x more matches";
    if (completionPercentage < 90)
      return "💡 Add lifestyle preferences to boost visibility";
    if (completionPercentage < 100)
      return "💡 Almost there! Complete remaining fields";
    return "🎉 Your profile is complete!";
  };

  const getScoreColor = () => {
    if (completionPercentage < 40) return "#FF6B6B";
    if (completionPercentage < 70) return Colors.light.gold;
    return Colors.light.green;
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          !isProfileComplete &&
          router.push("/complete-profile/terms-conditions")
        }
        activeOpacity={isProfileComplete ? 1 : 0.7}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name="heart-circle"
              size={20}
              color={Colors.light.maroon}
            />
            <Text style={styles.title}>Profile Health</Text>
          </View>
          <View
            style={[styles.scoreBadge, { backgroundColor: getScoreColor() }]}
          >
            <Text style={styles.score}>{completionPercentage}%</Text>
          </View>
        </View>

        <View style={styles.barContainer}>
          <View
            style={[
              styles.barFill,
              {
                width: `${completionPercentage}%`,
                backgroundColor: getScoreColor(),
              },
            ]}
          />
        </View>

        <Text style={styles.tip}>{getTip()}</Text>

        {!isProfileComplete && (
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Complete Now</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={Colors.light.maroon}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  score: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFF",
  },
  barContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  tip: {
    fontSize: 13,
    color: "#666",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
});
