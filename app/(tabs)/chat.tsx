import RiveDemo from "@/components/ui/RiveDemo";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inbox / Chat Screen</Text>
      <RiveDemo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.ivory,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
