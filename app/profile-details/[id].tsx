import { Colors } from "@/constants/Colors";
import { MOCK_PROFILES } from "@/constants/MockData";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// --- REUSABLE COMPONENTS FOR THIS PAGE ---

const StatBadge = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View style={styles.statBadge}>
    <View style={styles.statIconBox}>
      <Ionicons name={icon} size={18} color={Colors.light.maroon} />
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const AccordionItem = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={icon}
            size={20}
            color={Colors.light.maroon}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

// --- MAIN PROFILE SCREEN ---

export default function ProfileDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const profile = MOCK_PROFILES.find((p) => p.id === id);

  if (!profile) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text>Profile not found.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: Colors.light.maroon }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parallax Header Animation
  const headerHeight = height * 0.45;
  const translateY = scrollY.interpolate({
    inputRange: [-headerHeight, 0, headerHeight],
    outputRange: [headerHeight / 2, 0, -headerHeight / 3],
    extrapolate: "clamp",
  });
  const imageScale = scrollY.interpolate({
    inputRange: [-headerHeight, 0],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* PARALLAX HEADER IMAGE */}
      <Animated.View
        style={[
          styles.headerImageContainer,
          {
            height: headerHeight,
            transform: [{ translateY }, { scale: imageScale }],
          },
        ]}
      >
        <Image
          source={profile.image}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "transparent"]}
          style={styles.topGradient}
        />
      </Animated.View>

      {/* FLOATING HEADER CONTROLS */}
      <View style={[styles.topControls, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE CONTENT */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight - 40,
          paddingBottom: 100,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          {/* DRAG HANDLE INDICATOR */}
          <View style={styles.dragHandle} />

          {/* HERO INFO */}
          <View style={styles.heroSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.jobText}>{profile.job}</Text>
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
            {/* Completion Circle */}
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>85%</Text>
              <Text style={styles.completionLabel}>Profile</Text>
            </View>
          </View>

          {/* PRIMARY CTA - GOLD GRADIENT BUTTON */}
          <TouchableOpacity style={styles.ctaWrapper}>
            <LinearGradient
              colors={[Colors.light.gold, "#FDB931"]}
              style={styles.primaryBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryBtnText}>Connect Now</Text>
              <Ionicons
                name="send"
                size={18}
                color={Colors.light.maroon}
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* QUICK STATS STRIP */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsStrip}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <StatBadge
              icon="star"
              label="Match Score"
              value={profile.compatibility + "%"}
            />
            <StatBadge
              icon="moon"
              label="Kundali"
              value={profile.kundaliMatch || "Matched"}
            />
            <StatBadge
              icon="book"
              label="Education"
              value={profile.education.split(" ")[0]}
            />
            <StatBadge
              icon="restaurant"
              label="Lifestyle"
              value={profile.lifestyle.split(",")[0]}
            />
          </ScrollView>

          {/* WHY THIS PROFILE */}
          <View style={styles.whySection}>
            <Text style={styles.sectionTitle}>Why we recommend</Text>
            <View style={styles.recommendationRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={Colors.light.gold}
              />
              <Text style={styles.recText}>Matches your age preference</Text>
            </View>
            <View style={styles.recommendationRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={Colors.light.gold}
              />
              <Text style={styles.recText}>Highly compatible lifestyle</Text>
            </View>
          </View>

          {/* ABOUT ME */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* PHOTO GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {profile.images &&
                profile.images.map((img: any, idx: number) => (
                  <Image key={idx} source={img} style={styles.galleryImage} />
                ))}
            </ScrollView>
          </View>

          {/* DETAILED ACCORDIONS */}
          <View style={styles.section}>
            <AccordionItem title="Basic Details" icon="person-outline">
              <Text style={styles.detailText}>Height: {profile.height}</Text>
              <Text style={styles.detailText}>
                Religion: {profile.religion}
              </Text>
              <Text style={styles.detailText}>Mother Tongue: Hindi</Text>
            </AccordionItem>
            <AccordionItem title="Education & Career" icon="school-outline">
              <Text style={styles.detailText}>
                Highest Degree: {profile.education}
              </Text>
              <Text style={styles.detailText}>Occupation: {profile.job}</Text>
              <Text style={styles.detailText}>
                Annual Income: Not Specified
              </Text>
            </AccordionItem>
            <AccordionItem title="Family Details" icon="people-outline">
              <Text style={styles.detailText}>Father: Businessman</Text>
              <Text style={styles.detailText}>Mother: Homemaker</Text>
              <Text style={styles.detailText}>Siblings: 1 Brother</Text>
            </AccordionItem>
          </View>

          {/* TRUST & SAFETY */}
          <View style={[styles.section, styles.trustSection]}>
            <View style={styles.verifiedRow}>
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.verifiedText}>ID Verified</Text>
            </View>
            <View style={styles.verifiedRow}>
              <MaterialCommunityIcons
                name="cellphone-check"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.verifiedText}>Phone Verified</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.ivory,
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  topControls: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentCard: {
    backgroundColor: Colors.light.ivory,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    minHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  heroSection: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginBottom: 25,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  jobText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#777",
  },
  completionBadge: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.light.gold,
    backgroundColor: "#fff",
  },
  completionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.maroon,
  },
  completionLabel: {
    fontSize: 8,
    color: "#777",
  },
  ctaWrapper: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  primaryBtn: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    letterSpacing: 0.5,
  },
  statsStrip: {
    marginBottom: 25,
  },
  statBadge: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(128,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statLabel: {
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  whySection: {
    marginHorizontal: 25,
    padding: 20,
    backgroundColor: "rgba(255, 215, 0, 0.1)", // Light gold bg
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  section: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  recommendationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recText: {
    fontSize: 14,
    color: Colors.light.maroon,
    marginLeft: 10,
    fontWeight: "500",
  },
  bioText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
  },
  accordionContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#fafafa",
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  trustSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    marginLeft: 6,
  },
});
