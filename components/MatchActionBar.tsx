import { Colors } from "@/constants/Colors";
import {
    Ionicons
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from "react-native-reanimated";

interface MatchActionBarProps {
  onRewind: () => void;
  onNope: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

const ActionButton = ({
  icon,
  color,
  onPress,
  size = 50,
  iconSize = 24,
}: {
  icon: any;
  color: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.8), withSpring(1.0));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Animated.View
        style={[
          styles.button,
          {
            width: size,
            height: size,
            backgroundColor: "#fff",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          animatedStyle,
        ]}
      >
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function MatchActionBar({
  onRewind,
  onNope,
  onLike,
  onSuperLike,
}: MatchActionBarProps) {
  return (
    <View style={styles.container}>
      {/* Rewind */}
      <ActionButton
        onPress={onRewind}
        size={60} // Uniform size
        iconSize={26}
        color={Colors.light.gold}
        icon={
          <Ionicons name="refresh" size={26} color={Colors.light.gold} /> // Modern Refresh icon
        }
      />

      {/* Nope (Skip) */}
      <ActionButton
        onPress={onNope}
        size={60}
        iconSize={30}
        color={Colors.light.maroon}
        icon={<Ionicons name="close" size={30} color={Colors.light.maroon} />}
      />

      {/* Super Like */}
      <ActionButton
        onPress={onSuperLike}
        size={60}
        iconSize={26}
        color={Colors.light.saffron}
        icon={<Ionicons name="star" size={26} color={Colors.light.saffron} />} // Ionicons Star
      />

      {/* Like */}
      <ActionButton
        onPress={onLike}
        size={60}
        iconSize={30}
        color={Colors.light.green}
        icon={<Ionicons name="heart" size={30} color={Colors.light.green} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
    paddingTop: 10,
  },
  button: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
});
