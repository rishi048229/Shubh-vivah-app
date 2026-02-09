import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface InfoItem {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

interface PillInfoCardProps {
  title: string;
  titleIcon: keyof typeof Ionicons.glyphMap;
  items: InfoItem[];
  onEdit: () => void;
  index?: number;
}

export const PillInfoCard = ({
  title,
  titleIcon,
  items,
  onEdit,
  index = 0,
}: PillInfoCardProps) => {
  const editScale = useSharedValue(1);

  const handleEditPress = () => {
    editScale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      editScale.value = withSpring(1, { damping: 15 });
      onEdit();
    }, 100);
  };

  const editButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 100)}
      style={styles.container}
    >
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={titleIcon} size={18} color={Colors.light.gold} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Animated.View style={editButtonStyle}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={14} color={Colors.light.maroon} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Info Pills */}
      <View style={styles.pillsContainer}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.pill}>
            {item.icon && (
              <Ionicons
                name={item.icon}
                size={14}
                color={Colors.light.gold}
                style={styles.pillIcon}
              />
            )}
            <Text style={styles.pillLabel}>{item.label}:</Text>
            <Text style={styles.pillValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.ivory,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.maroon,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.maroon,
    letterSpacing: 0.2,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.lightMaroon,
    alignItems: "center",
    justifyContent: "center",
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(128, 0, 0, 0.1)",
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 4,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.maroon,
  },
});
