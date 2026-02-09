import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    SlideInDown,
    SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditSection = "basic" | "education" | "family" | "lifestyle" | null;

interface ProfileEditSheetProps {
  visible: boolean;
  section: EditSection;
  onClose: () => void;
}

const SECTION_CONFIG = {
  basic: {
    title: "Edit Basic Details",
    description: "Update your personal information",
    icon: "person-outline" as const,
    route: "/complete-profile/basic-details",
    quickFields: ["Height", "Marital Status", "Religion", "Community"],
  },
  education: {
    title: "Edit Education & Career",
    description: "Update your professional details",
    icon: "school-outline" as const,
    route: "/complete-profile/education-details",
    quickFields: ["Education", "Profession", "Annual Income"],
  },
  family: {
    title: "Edit Family Details",
    description: "Update your family information",
    icon: "people-outline" as const,
    route: "/complete-profile/family-details",
    quickFields: ["Family Type", "Father's Occupation", "Mother's Occupation"],
  },
  lifestyle: {
    title: "Edit Lifestyle",
    description: "Update your lifestyle preferences",
    icon: "leaf-outline" as const,
    route: "/complete-profile/lifestyle-habits",
    quickFields: ["Eating Habits", "Diet Preference", "Drinking", "Smoking"],
  },
};

export const ProfileEditSheet = ({
  visible,
  section,
  onClose,
}: ProfileEditSheetProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!section) return null;

  const config = SECTION_CONFIG[section];

  const handleFullEdit = () => {
    onClose();
    setTimeout(() => {
      router.push(config.route as any);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(200)}
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name={config.icon}
                size={24}
                color={Colors.light.gold}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{config.title}</Text>
              <Text style={styles.description}>{config.description}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Quick Fields Preview */}
          <ScrollView
            style={styles.fieldsContainer}
            showsVerticalScrollIndicator={false}
          >
            {config.quickFields.map((field, index) => (
              <View key={index} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{field}</Text>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldValueText}>Not set</Text>
                  <Ionicons name="chevron-forward" size={16} color="#CCC" />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Full Edit Button */}
          <TouchableOpacity
            style={styles.fullEditButton}
            onPress={handleFullEdit}
            activeOpacity={0.85}
          >
            <Text style={styles.fullEditText}>Edit All Details</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={Colors.light.gold}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.maroon,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#888",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  fieldLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  fieldValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fieldValueText: {
    fontSize: 14,
    color: "#999",
  },
  fullEditButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.maroon,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  fullEditText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
});
