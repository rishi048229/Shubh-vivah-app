import {
    PeopleFilterBar,
    PeopleFilterPanel,
} from "@/components/people/PeopleFilterBar";
import { PeopleNearYouSection } from "@/components/people/PeopleNearYouSection";
// import { BestMatchHero } from "@/components/people/BestMatchHero";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConnectionsScreen() {
  const insets = useSafeAreaInsets();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky Filter Bar */}
      <PeopleFilterBar
        isExpanded={isFilterOpen}
        onExpand={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Expandable Filter Panel (Overlay) */}
      <View style={styles.panelWrapper}>
        <PeopleFilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* <BestMatchHero /> */}
        <SwipeDeck />
        <PeopleNearYouSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.ivory,
  },
  panelWrapper: {
    position: "absolute",
    top: 100, // Adjust based on header height + filter bar
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
