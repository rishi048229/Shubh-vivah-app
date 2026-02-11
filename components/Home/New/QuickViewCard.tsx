import { MatchProfile } from "@/types/connections";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface QuickViewCardProps {
  profile: MatchProfile;
  onPress: () => void;
}

export default function QuickViewCard({
  profile,
  onPress,
}: QuickViewCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: profile.imageUri }}
        style={styles.image}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.age}>
            {profile.age} • {profile.city.split(",")[0]}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140, // Fixed width for horizontal scrolling
    height: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EEE",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%", // Gradient covers more area for small cards readability
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  age: {
    fontSize: 12,
    color: "#DDD",
    marginTop: 2,
  },
});
