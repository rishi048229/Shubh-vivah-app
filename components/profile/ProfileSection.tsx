import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    useSharedValue
} from "react-native-reanimated";

interface ProfileSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}

export const ProfileSection = ({
  title,
  isExpanded,
  onToggle,
  onEdit,
  children,
}: ProfileSectionProps) => {
  const height = useSharedValue(0);

  // Update shared value when expanded changes (simplified logic, ideally measure content)
  // For simplicity MVP we skip complex measurement and just toggle visibility or use a preset height if content is fixed,
  // but better to just conditionally render children for now without complex reanimated height if not necessary for MVP.
  // Actually, conditional rendering is cleaner for this request "No long scrolling blocks".

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={Colors.light.maroon} />
          </TouchableOpacity>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
            style={{ marginLeft: 10 }}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  editBtn: {
    padding: 5,
    backgroundColor: "#FFF0F0",
    borderRadius: 15,
  },
  sectionContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 10,
  },
});
