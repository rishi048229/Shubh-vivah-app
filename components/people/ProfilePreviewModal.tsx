import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfilePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  person: any; // Replace with proper type
}

export const ProfilePreviewModal = ({
  visible,
  onClose,
  person,
}: ProfilePreviewModalProps) => {
  const router = useRouter();
  if (!person) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: person.image }} style={styles.image} />
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>
                {person.name}, {person.age}
              </Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{person.matchScore}% Match</Text>
              </View>
            </View>
            <Text style={styles.location}>
              {person.location || person.distance}
            </Text>

            <View style={styles.reasons}>
              <View style={styles.reasonChip}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.light.maroon}
                />
                <Text style={styles.reasonText}>Kundali Matched</Text>
              </View>
              <View style={styles.reasonChip}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.light.maroon}
                />
                <Text style={styles.reasonText}>Same Community</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              onPress={() => {
                onClose();
                router.push({
                  pathname: "/profile-details/[id]",
                  params: { id: person.id },
                });
              }}
            >
              <Text style={styles.viewProfileText}>View Full Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  imageContainer: {
    height: 250,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  matchBadge: {
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  reasons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  reasonChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.ivory,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 12,
    color: Colors.light.maroon,
  },
  viewProfileBtn: {
    backgroundColor: Colors.light.maroon,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  viewProfileText: {
    color: Colors.light.gold,
    fontWeight: "bold",
    fontSize: 16,
  },
});
