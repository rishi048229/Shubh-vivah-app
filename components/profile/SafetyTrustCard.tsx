import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface VerificationItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isVerified: boolean;
}

interface SafetyTrustCardProps {
  lastActive?: string;
}

export const SafetyTrustCard = ({
  lastActive = "Just now",
}: SafetyTrustCardProps) => {
  const verifications: VerificationItem[] = [
    { label: "Profile Verified", icon: "person-circle", isVerified: true },
    { label: "ID Verified", icon: "id-card", isVerified: false },
    { label: "Phone Verified", icon: "call", isVerified: true },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(500)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons
          name="shield-checkmark"
          size={18}
          color={Colors.light.verified}
        />
        <Text style={styles.title}>Safety & Trust</Text>
      </View>

      {/* Verification Badges */}
      <View style={styles.verificationGrid}>
        {verifications.map((item, index) => (
          <View key={index} style={styles.verificationItem}>
            <View
              style={[
                styles.verificationIcon,
                item.isVerified && styles.verifiedIcon,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={item.isVerified ? Colors.light.verified : "#999"}
              />
            </View>
            <Text
              style={[
                styles.verificationLabel,
                item.isVerified && styles.verifiedLabel,
              ]}
            >
              {item.label}
            </Text>
            {item.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={Colors.light.verified}
                style={styles.checkIcon}
              />
            )}
          </View>
        ))}
      </View>

      {/* Last Active */}
      <View style={styles.lastActive}>
        <View style={styles.activeDot} />
        <Text style={styles.lastActiveText}>Last Active: {lastActive}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.maroon,
  },
  verificationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.ivory,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  verificationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedIcon: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
  verificationLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  verifiedLabel: {
    color: "#333",
  },
  checkIcon: {
    marginLeft: 2,
  },
  lastActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.verified,
  },
  lastActiveText: {
    fontSize: 13,
    color: "#666",
  },
});
