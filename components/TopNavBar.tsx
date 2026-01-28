import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopNavBarProps {
  onMenuPress: () => void;
  onProfilePress: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onMenuPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={Colors.light.maroon} />
        </TouchableOpacity>

        <Animated.Text
          entering={FadeInRight.duration(1000).springify()}
          style={styles.title}
        >
          Shubh Vivah
        </Animated.Text>

        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=5" }} // Placeholder image
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    zIndex: 100,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.glassBackground,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28, // Larger for cursive look
    fontWeight: "bold",
    color: Colors.light.maroon,
    fontFamily: Platform.select({ ios: "Snell Roundhand", android: "serif" }), // Cursive-like on iOS, serif on Android
    fontStyle: "italic", // Simulate cursive
  },
  profileButton: {
    padding: 2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
