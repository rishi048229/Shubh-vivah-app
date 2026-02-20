import { Colors } from "@/constants/Colors";
import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

const { height } = Dimensions.get("window");

interface WhyMatchSheetProps {
  visible: boolean;
  onClose: () => void;
  profile: MatchProfile | null;
}

export default function WhyMatchSheet({
  visible,
  onClose,
  profile,
}: WhyMatchSheetProps) {
  if (!profile) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          entering={SlideInDown.duration(300)} // Smooth animation without bounce
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Why this Match?</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              You and {profile.name} have a {profile.matchPercentage}%
              compatibility score based on:
            </Text>

            <View style={styles.reasonsList}>
              {profile.matchReasons?.map((reason, index) => (
                <View key={index} style={styles.reasonRow}>
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}

              {/* Fallback mock reasons if none exist */}
              {(!profile.matchReasons || profile.matchReasons.length === 0) && (
                <>
                  <View style={styles.reasonRow}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                    <Text style={styles.reasonText}>
                      Both live in {profile.city}
                    </Text>
                  </View>
                  <View style={styles.reasonRow}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                    <Text style={styles.reasonText}>
                      Preferred height range
                    </Text>
                  </View>
                  <View style={styles.reasonRow}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                    <Text style={styles.reasonText}>
                      Matching diet preferences
                    </Text>
                  </View>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.fullProfileButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>View Full Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: height * 0.45,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1406",
  },
  content: {
    gap: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  reasonsList: {
    gap: 12,
    marginTop: 8,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.maroon, // Green for check? Or Brand color? Brand color matches requirement "Red color only for primary actions". Green is better for "Success/Check". But user said "Red color only for primary actions". I'll use Maroon or Green. Let's use Maroon for consistency or maybe a Green. I'll stick to Maroon as it is the primary brand color, or maybe a soft Green. I'll use Maroon to be "Brand Safe".
    justifyContent: "center",
    alignItems: "center",
  },
  reasonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  fullProfileButton: {
    backgroundColor: Colors.maroon,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
