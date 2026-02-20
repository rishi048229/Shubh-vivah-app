import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import ActionCenterButton from "./ActionCenterButton";

interface ActionCenterSectionProps {
  onPress: (action: string) => void;
}

export default function ActionCenterSection({
  onPress,
}: ActionCenterSectionProps) {
  return (
    <View style={styles.container}>
      <ActionCenterButton
        icon="heart"
        label="Likes"
        color={Colors.maroon}
        onPress={() => onPress("likes")}
      />
      <ActionCenterButton
        icon="eye"
        label="Views"
        color="#8B4513"
        onPress={() => onPress("views")}
      />
      <ActionCenterButton
        icon="chatbubble-ellipses"
        label="Messages"
        color="#CD7F32"
        onPress={() => onPress("messages")}
      />
      <ActionCenterButton
        icon="bookmark" // Changed from star to bookmark/book
        label="Shortlisted"
        color="#800000"
        onPress={() => onPress("shortlisted")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 10,
    backgroundColor: "transparent",
  },
});
