import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Events Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.ivory,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
});
