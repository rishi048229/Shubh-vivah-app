import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInLeft,
    SlideOutLeft,
} from "react-native-reanimated";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.8; // 80% screen width

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  children?: React.ReactNode;
  isExpanded: boolean;
  onPress: () => void;
};

const MenuItem = ({
  icon,
  label,
  children,
  isExpanded,
  onPress,
}: MenuItemProps) => {
  return (
    <View style={styles.menuItemContainer}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={22} color="white" />
          </View>
          <Text style={styles.menuItemLabel}>{label}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
      {/* 
        You can also leave LayoutAnimation for accordion expanding, 
        or switch to Reanimated for that too. 
        Keeping as is for now since user only complained about the side menu sliding.
      */}
      {isExpanded && <View style={styles.menuContent}>{children}</View>}
    </View>
  );
};

// Sub-item row for the accordion content
const MenuSubItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.subItemRow}>
    <Text style={styles.subItemLabel}>{label}</Text>
    <Text style={styles.subItemValue}>{value}</Text>
  </View>
);

export default function SideMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const router = useRouter();

  const toggleItem = (label: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItem(expandedItem === label ? null : label);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none" // Turn off default modal animation to use Reanimated
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Blur/Dark Background */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose}>
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.backdropFill}
          />
        </TouchableOpacity>

        {/* Side Drawer with SlideInLeft */}
        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.drawer}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/32.jpg",
                    }}
                    style={styles.profileImage}
                  />
                  <View style={styles.addIconBadge}>
                    <Ionicons name="add" size={12} color="white" />
                  </View>
                </View>

                <Text style={styles.profileName}>Rahul More</Text>

                <TouchableOpacity style={styles.editProfileButton}>
                  <Ionicons name="create-outline" size={16} color="#C21807" />
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />

              {/* Menu Items - Updated to match design */}
              <View style={styles.menuList}>
                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    onClose();
                    router.push("/profile" as any);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="person-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Profile</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Matches */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="heart-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>
                      Matches & Connection
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Messages */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color="white"
                    />
                    <Text style={styles.menuItemLabel}>Messages</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Astro & Kundali */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="planet-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Astro & Kundali</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Services */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="gift-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Services</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Membership */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="diamond-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Membership plan</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Navigate to Settings */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="settings-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Settings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity
                  style={styles.simpleMenuItem}
                  onPress={() => {
                    /* Handle Logout */
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="log-out-outline" size={22} color="white" />
                    <Text style={styles.menuItemLabel}>Logout</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Bottom Chat / Service buttons from design (Optional matching) */}
              <View style={styles.bottomActions}>
                {/* Can add bottom buttons here if needed, keeping it simple for now */}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    width: MENU_WIDTH,
    height: "100%",
    backgroundColor: "#C21807", // Red background
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.gold, // Gold border
  },
  addIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#C21807",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editProfileText: {
    color: "#C21807",
    fontWeight: "bold",
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  menuList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItemContainer: {
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    // width: 30,
    // alignItems: 'center'
  },
  menuItemLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  simpleMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  menuContent: {
    marginTop: 10,
    marginLeft: 40, // Indent content
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: 10,
  },
  subItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  subItemLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  subItemValue: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  settingsOption: {
    paddingVertical: 8,
  },
  settingsOptionText: {
    color: "white",
    fontSize: 14,
  },
  bottomActions: {
    padding: 20,
  },
});
