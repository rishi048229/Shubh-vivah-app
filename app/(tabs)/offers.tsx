import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export default function OffersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Offers Screen</Text>
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
