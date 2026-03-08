import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";

// Mock data for blocked users. In a real application, this would be fetched from an API.
const INITIAL_BLOCKED_USERS = [
  { id: "1", name: "Ravi Kumar", age: 28, imageUri: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "2", name: "Anjali Gupta", age: 26, imageUri: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "3", name: "Vikram Singh", age: 31, imageUri: "https://randomuser.me/api/portraits/men/46.jpg" },
];

export default function BlockedSettingsScreen() {
  const router = useRouter();
  const [blockedUsers, setBlockedUsers] = useState(INITIAL_BLOCKED_USERS);

  const handleUnblock = (id: string, name: string) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${name}? They will be able to see your profile and interact with you again.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unblock", 
          style: "destructive",
          onPress: () => {
            // Remove user from the list
            setBlockedUsers(prev => prev.filter(user => user.id !== id));
            // TODO: API call to unblock user
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2D1406" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={22} color={Colors.maroon} />
          <Text style={styles.description}>
            Blocked users cannot see your profile, send you messages, or interact with you in any way.
          </Text>
        </View>

        {blockedUsers.length > 0 ? (
          <View style={styles.listContainer}>
            {blockedUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <Image source={{ uri: user.imageUri }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userMeta}>{user.age} yrs</Text>
                </View>
                <TouchableOpacity 
                  style={styles.unblockButton} 
                  onPress={() => handleUnblock(user.id, user.name)}
                >
                  <Text style={styles.unblockText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={48} color={Colors.gold} />
            </View>
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.ivory,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D1406",
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FCECD4",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 24,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: "#6B5E55",
    marginLeft: 12,
    lineHeight: 20,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D1406",
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    color: "#856A5D",
  },
  unblockButton: {
    backgroundColor: "#FFF1F2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  unblockText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#BE123C",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D1406",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#856A5D",
    textAlign: "center",
  },
});
