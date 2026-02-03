import { Colors } from "@/constants/Colors";
import {
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

interface PeopleCardProps {
  name: string;
  age: number;
  distance: string;
  matchScore: number;
  image: string;
  isFamilyAssisted?: boolean; // Feature #7
  isVerified?: boolean; // Feature #14
}

export const PeopleCard = ({
  name,
  age,
  distance,
  matchScore,
  image,
  isFamilyAssisted = true, // Default to true for demo
  isVerified = true, // Default to true for demo
}: PeopleCardProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showStory, setShowStory] = useState(false);

  // Icebreaker options (Feature #4)
  const icebreakers = ["Values", "Travel", "Career"];

  return (
    <View style={styles.card}>
      {/* Feature #8: Micro Stories (Rings around image) */}
      <TouchableOpacity onPress={() => setShowStory(true)} activeOpacity={0.8}>
        <View style={styles.storyRingContainer}>
          <View
            style={[styles.storyRing, { borderColor: Colors.light.gold }]}
          />
          <View
            style={[
              styles.storyRing,
              {
                borderColor: Colors.light.maroon,
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {name}, {age}
            {/* Feature #14: Trust Signal (ID Verified) */}
            {isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color="#3B92FF"
                style={{ marginLeft: 4 }}
              />
            )}
          </Text>

          {/* Feature #6: Why You See This (Info Icon) */}
          <TouchableOpacity
            onPress={() => setShowInfo(true)}
            style={styles.infoIcon}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Feature #7: Family Assisted Badge */}
        {isFamilyAssisted && (
          <View style={styles.familyBadge}>
            <MaterialCommunityIcons
              name="account-group"
              size={12}
              color="#666"
            />
            <Text style={styles.familyText}>Family Assisted</Text>
          </View>
        )}

        <Text style={styles.distance}>{distance}</Text>

        {/* Feature #14: Expanded Trust Badges (Profession, Education) */}
        <View style={styles.trustRow}>
          <View style={styles.trustTag}>
            <Ionicons name="school" size={10} color="#555" />
            <Text style={styles.trustText}>MBA</Text>
          </View>
          <View style={styles.trustTag}>
            <Ionicons name="briefcase" size={10} color="#555" />
            <Text style={styles.trustText}>Software..</Text>
          </View>
        </View>

        {/* Feature #11: AI Match Coach */}
        <View style={styles.aiHintContainer}>
          <MaterialCommunityIcons
            name="robot-excited-outline"
            size={12}
            color={Colors.light.maroon}
          />
          <Text style={styles.aiHintText}>
            Profiles like this reply 40% faster
          </Text>
        </View>
      </View>

      {/* Right Side Actions */}
      <View style={{ alignItems: "center", gap: 10 }}>
        {/* Match Score */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{matchScore}%</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={Colors.light.maroon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={Colors.light.maroon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature #4: Icebreakers (Bottom Row) */}
      <View style={styles.icebreakerRow}>
        <Text style={styles.icebreakerLabel}>Ask about...</Text>
        {icebreakers.map((ib) => (
          <TouchableOpacity key={ib} style={styles.icebreakerChip}>
            <Text style={styles.icebreakerText}>{ib}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info Modal (Feature #6) */}
      <Modal visible={showInfo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why You See This Profile</Text>

            <View style={styles.infoItem}>
              <Ionicons name="locate" size={18} color={Colors.light.maroon} />
              <Text style={styles.infoText}>Within 10 km proximity</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="heart" size={18} color={Colors.light.maroon} />
              <Text style={styles.infoText}>90% Interest Match</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flash" size={18} color={Colors.light.maroon} />
              <Text style={styles.infoText}>Highly Active Today</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowInfo(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Story Modal (Feature #8) */}
      <Modal visible={showStory} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowStory(false)}
          style={styles.modalOverlay}
        >
          <Animated.View entering={ZoomIn} style={styles.storyContent}>
            <Image source={{ uri: image }} style={styles.storyImage} />
            <Text style={styles.storyTitle}>{name}'s Micro Stories</Text>

            <View style={styles.storyRow}>
              <View style={styles.storyItem}>
                <View
                  style={[
                    styles.storyIconCircle,
                    { backgroundColor: "#ffebeb" },
                  ]}
                >
                  <Text>🎉</Text>
                </View>
                <Text style={styles.storyLabel}>Lifestyle</Text>
              </View>
              <View style={styles.storyItem}>
                <View
                  style={[
                    styles.storyIconCircle,
                    { backgroundColor: "#e3f2fd" },
                  ]}
                >
                  <Text>👪</Text>
                </View>
                <Text style={styles.storyLabel}>Family</Text>
              </View>
              <View style={styles.storyItem}>
                <View
                  style={[
                    styles.storyIconCircle,
                    { backgroundColor: "#e8f5e9" },
                  ]}
                >
                  <Text>🌱</Text>
                </View>
                <Text style={styles.storyLabel}>Goals</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  storyRingContainer: {
    position: "relative",
    marginRight: 12,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  storyRing: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    opacity: 0.6,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.maroon,
    flexDirection: "row",
  },
  infoIcon: {
    padding: 4,
  },
  familyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  familyText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  matchBadge: {
    backgroundColor: Colors.light.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  distance: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  trustRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  trustTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trustText: {
    fontSize: 9,
    color: "#555",
  },
  aiHintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    backgroundColor: "rgba(128, 0, 0, 0.05)",
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  aiHintText: {
    fontSize: 10,
    color: Colors.light.maroon,
    fontWeight: "600",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.ivory,
    alignItems: "center",
    justifyContent: "center",
  },
  likeBtn: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  icebreakerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 8,
  },
  icebreakerLabel: {
    fontSize: 10,
    color: "#888",
    fontStyle: "italic",
  },
  icebreakerChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.light.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  icebreakerText: {
    fontSize: 10,
    color: Colors.light.maroon,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 16,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
  },
  closeText: {
    color: Colors.light.maroon,
    fontWeight: "bold",
  },
  storyContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "70%",
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.light.gold,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  storyRow: {
    flexDirection: "row",
    gap: 15,
  },
  storyItem: {
    alignItems: "center",
  },
  storyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  storyLabel: {
    fontSize: 10,
    color: "#666",
  },
});
