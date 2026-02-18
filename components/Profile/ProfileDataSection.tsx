import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProfileDataRow {
  label: string;
  value: string;
}

interface ProfileDataSectionProps {
  title: string;
  data: ProfileDataRow[];
}

export default function ProfileDataSection({
  title,
  data,
}: ProfileDataSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Data Table */}
      <View style={styles.table}>
        {data.map((row, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index !== data.length - 1 && styles.rowBorder, // Add border except for last item
            ]}
          >
            <View style={styles.labelCol}>
              <Text style={styles.labelText}>{row.label}</Text>
            </View>
            <View style={styles.valueCol}>
              <Text style={styles.valueText}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    marginLeft: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: "#D32F2F", // Red border
    borderRadius: 15,
    backgroundColor: "#FFF8E7", // Cream background
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EBD8B2", // Light separator
  },
  labelCol: {
    flex: 0.4, // 40% width
  },
  valueCol: {
    flex: 0.6, // 60% width
  },
  labelText: {
    fontSize: 14,
    color: "#D32F2F", // Red label
    fontWeight: "600",
  },
  valueText: {
    fontSize: 14,
    color: "#333",
  },
});
