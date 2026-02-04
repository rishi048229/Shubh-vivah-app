import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../../utils/colors";

const Button = ({
  title,
  onPress,
  isLoading,
  disabled,
  style,
  paddingVertical = 14,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    console.warn("DEBUG: Button Pressed In");
    Animated.spring(scaleAnim, {
      toValue: 0.96, // Subtle scale down
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Back to normal
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled || isLoading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}
      >
        <LinearGradient
          colors={
            disabled ? [Colors.border, Colors.border] : Colors.primaryGradient
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { paddingVertical }]}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 5,
    elevation: 5, // Increased elevation
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Outfit_700Bold", // Modern sans-serif
    letterSpacing: 0.5,
  },
});

export default Button;
