import { MatchProfile } from "@/types/connections";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MatchPercentageRing from "../../MatchPercentageRing";

const { width, height } = Dimensions.get("window");

interface QuickViewModalProps {
  visible: boolean;
  profile: MatchProfile | null;
  onClose: () => void;
}

export default function QuickViewModal({
  visible,
  profile,
  onClose,
}: QuickViewModalProps) {
  const router = useRouter();

  if (!profile) return null;

  const handleConnect = () => {
    // Implement connect logic
    console.log("Connect requested with", profile.name);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        >
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 50 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, translateY: 50 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.card}
        >
          {/* Full Image Background */}
          <ImageBackground
            source={{ uri: profile.imageUri }}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 24 }}
          >
            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]}
              style={styles.gradient}
            />

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Content Container */}
            <View style={styles.content}>
              {/* Header Info */}
              <View style={styles.header}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{profile.name}</Text>
                  {profile.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#2196F3"
                    />
                  )}
                </View>
                <Text style={styles.profession}>{profile.profession}</Text>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <View style={styles.ringContainer}>
                    <MatchPercentageRing
                      percentage={profile.matchPercentage}
                      size={40}
                      strokeWidth={3}
                      textSize={10}
                    />
                  </View>
                  <Text style={styles.statLabel}>Match</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.age}</Text>
                  <Text style={styles.statLabel}>Age</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {profile.height ? profile.height.split(" ")[0] : "N/A"}
                  </Text>
                  <Text style={styles.statLabel}>Height</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12 LPA</Text>
                  {/* Placeholder for Income/Rate */}
                  <Text style={styles.statLabel}>Income</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.connectButton, { backgroundColor: "#800020" }]} // Maroon
                  onPress={handleConnect}
                >
                  <Text style={[styles.connectText, { color: "#FFF" }]}>
                    View Profile
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Ionicons name="bookmark-outline" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.85,
    height: height * 0.65,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imageBackground: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  profession: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  ringContainer: {
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  connectButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  connectText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
