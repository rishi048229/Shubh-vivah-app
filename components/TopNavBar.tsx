import { Colors } from "@/constants/Colors";
import {
    GreatVibes_400Regular,
    useFonts,
} from "@expo-google-fonts/great-vibes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
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

  let [fontsLoaded] = useFonts({
    GreatVibes_400Regular,
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={Colors.light.maroon} />
        </TouchableOpacity>

        {fontsLoaded && (
          <Animated.Text
            entering={FadeInRight.duration(1000).springify()}
            style={[styles.title, { fontFamily: "GreatVibes_400Regular" }]}
          >
            Shubh Vivah
          </Animated.Text>
        )}

        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
            }} // Better placeholder
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent", // Or semi-transparent for overlay effect
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
    backgroundColor: Colors.light.glassBackground, // Ensure this exists or fallback
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 42, // Increased for Great Vibes
    color: Colors.light.maroon,
    includeFontPadding: false,
    paddingBottom: 5, // Visual fix for cursive descenders
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
