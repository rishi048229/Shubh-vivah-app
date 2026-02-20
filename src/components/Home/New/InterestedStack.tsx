import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InterestedStackProps {
  count: number;
  avatars: string[];
  label?: string;
}

export default function InterestedStack({
  count,
  avatars,
  label = "people recently showed interest",
}: InterestedStackProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.avatarStack}>
        {avatars.slice(0, 3).map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
          />
        ))}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.countText}>
          {count} {label}
        </Text>
        <Text style={styles.actionText}>See who likes you</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  avatarStack: {
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    flex: 1,
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  actionText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 2,
  },
});
