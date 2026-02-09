import { Colors } from "@/constants/Colors";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProfileImagePickerProps {
  imageUri?: string;
  size?: number;
  showProgress?: boolean;
  completionPercentage?: number;
  editable?: boolean;
}

export const ProfileImagePicker = ({
  imageUri,
  size = 120,
  showProgress = true,
  completionPercentage = 0,
  editable = true,
}: ProfileImagePickerProps) => {
  const { setProfileImage } = useProfile();
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const radius = size / 2;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * (radius - strokeWidth);

  // Animate on mount
  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 500 });
    progress.value = withTiming(completionPercentage / 100, { duration: 1200 });
  }, [completionPercentage]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedProgressProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const handlePickImage = async () => {
    if (!editable) return;

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to change your profile picture.",
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await setProfileImage(result.assets[0].uri);
        // Animate success
        scale.value = withSpring(0.95, { damping: 10 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 15 });
        }, 150);
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to update profile picture. Please try again.",
        );
      }
    }
  };

  const defaultImage = "https://i.pravatar.cc/300?img=11";

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* Progress Ring */}
      {showProgress && (
        <View
          style={[styles.svgContainer, { width: size + 16, height: size + 16 }]}
        >
          <Svg width={size + 16} height={size + 16}>
            {/* Background Circle */}
            <Circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={radius - strokeWidth / 2}
              stroke={Colors.light.lightMaroon}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={radius - strokeWidth / 2}
              stroke={Colors.light.gold}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProgressProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${(size + 16) / 2}, ${(size + 16) / 2}`}
            />
          </Svg>
        </View>
      )}

      {/* Profile Image */}
      <View
        style={[
          styles.imageWrapper,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Image
          source={{ uri: imageUri || defaultImage }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </View>

      {/* Plus Button */}
      {editable && (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handlePickImage}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#FFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  plusButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.maroon,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
