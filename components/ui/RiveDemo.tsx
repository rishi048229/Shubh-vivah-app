import { Asset } from "expo-asset";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const riveFile = Asset.fromModule(require("@/assets/rive/demo.riv"));

export default function RiveDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rive Animation Demo</Text>
      {/* <Rive url={riveFile.uri} style={styles.rive} autoplay={true} /> */}
      <View
        style={[
          styles.rive,
          {
            backgroundColor: "#ddd",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={{ textAlign: "center", padding: 10 }}>
          Rive requires Native Build.{"\n"}Run: npx expo run:android
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 300, // Ensure container has height
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
  },
  text: {
    position: "absolute",
    top: 10,
    zIndex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  rive: {
    width: 300,
    height: 300,
  },
});
