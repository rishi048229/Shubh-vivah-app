import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CompactProfileCard } from "./CompactProfileCard";
import { PeopleFilterBar, PeopleFilterPanel } from "./PeopleFilterBar";
import { ProfilePreviewModal } from "./ProfilePreviewModal";

interface ExploreOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const ALL_PEOPLE = [
  {
    id: 1,
    name: "Riya Gupta",
    age: 24,
    location: "Mumbai",
    matchScore: 88,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 2,
    name: "Ananya Singh",
    age: 25,
    location: "Delhi",
    matchScore: 85,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Meera Patel",
    age: 23,
    location: "Ahmedabad",
    matchScore: 82,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 4,
    name: "Sanya Malhotra",
    age: 26,
    location: "Pune",
    matchScore: 79,
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 5,
    name: "Priya Sharma",
    age: 27,
    location: "Bangalore",
    matchScore: 92,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Neha Verma",
    age: 22,
    location: "Surat",
    matchScore: 75,
    image: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 7,
    name: "Kavita Das",
    age: 28,
    location: "Kolkata",
    matchScore: 70,
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 8,
    name: "Sneha Reddy",
    age: 25,
    location: "Hyderabad",
    matchScore: 68,
    image: "https://i.pravatar.cc/150?img=12",
  },
];

export const ExploreOverlay = ({ visible, onClose }: ExploreOverlayProps) => {
  const insets = useSafeAreaInsets();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.light.maroon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore All Profiles</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={24} color={Colors.light.maroon} />
          </TouchableOpacity>
        </View>

        {/* Filter Bar */}
        <PeopleFilterBar
          isExpanded={isFilterOpen}
          onExpand={() => setIsFilterOpen(!isFilterOpen)}
        />

        {/* Filter Panel */}
        <View style={styles.panelWrapper}>
          <PeopleFilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </View>

        {/* Grid Content */}
        <FlatList
          data={ALL_PEOPLE}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CompactProfileCard
              {...item}
              onPress={() => setSelectedPerson(item)}
            />
          )}
        />

        {/* Preview Modal */}
        <ProfilePreviewModal
          visible={!!selectedPerson}
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  closeBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  searchBtn: {
    padding: 5,
  },
  panelWrapper: {
    position: "absolute",
    top: 110, // Adjust based on header + filter bar
    left: 0,
    right: 0,
    zIndex: 100,
  },
  listContent: {
    padding: 10,
    paddingBottom: 50,
  },
});
