import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const JOURNEY_STAGES = [
  {
    id: 1,
    title: "Matchmaking",
    description:
      "Find your perfect match with verified profiles & smart filters.",
    image: require("@/assets/images/matchmaking.png"),
  },
  {
    id: 2,
    title: "Kundali Matching",
    description: "Free compatibility checks with expert astrological insights.",
    image: require("@/assets/images/kundali.png"),
  },
  {
    id: 3,
    title: "Pre-Wedding",
    description:
      "Discover trusted vendors for mehendi, makeup, and photography.",
    image: require("@/assets/images/pre_wedding.png"),
  },
  {
    id: 4,
    title: "The Wedding",
    description: "End-to-end planning support for your big day.",
    image: require("@/assets/images/wedding.png"),
  },
  {
    id: 5,
    title: "Reception",
    description: "Manage guest lists and celebrations seamlessly.",
    image: require("@/assets/images/reception.png"),
  },
  {
    id: 6,
    title: "Honeymoon",
    description: "Start your new life with curated romantic getaways.",
    image: require("@/assets/images/honeymoon.png"),
  },
];

export const WeddingJourneyServices = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Your Wedding Journey</Text>
        <Text style={styles.headerSubtitle}>With Shubh Vivah</Text>
      </View>

      <View style={styles.timelineContainer}>
        {JOURNEY_STAGES.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <JourneyStage stage={stage} index={index} />
            {/* {index < JOURNEY_STAGES.length - 1 && (
              <CurvedConnector index={index} />
            )} */}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const JourneyStage = ({
  stage,
  index,
}: {
  stage: (typeof JOURNEY_STAGES)[0];
  index: number;
}) => {
  const isLeft = index % 2 === 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 200).springify()}
      style={[
        styles.stageContainer,
        isLeft ? styles.stageLeft : styles.stageRight,
      ]}
    >
      {/* Content Box */}
      <View
        style={[
          styles.contentBox,
          isLeft ? styles.alignRight : styles.alignLeft,
        ]}
      >
        <Text style={styles.stageTitle}>{stage.title}</Text>
        <Text style={styles.stageDescription}>{stage.description}</Text>
      </View>

      {/* Image Box */}
      <View style={styles.imageBox}>
        <Image source={stage.image} style={styles.stageImage} />
      </View>
    </Animated.View>
  );
};

const CurvedConnector = ({ index }: { index: number }) => {
  const isLeftToRight = index % 2 === 0;
  // If LeftToRight: Curve starts from Left Image (approx 25% width) to Right Image (approx 75% width)
  // We need a container that spans the width

  return (
    <View style={styles.connectorContainer}>
      <Svg height="100" width={width} viewBox={`0 0 ${width} 100`}>
        <Path
          d={
            isLeftToRight
              ? `M ${width * 0.25 + 60} 0 C ${width * 0.25 + 60} 50, ${width * 0.75 - 60} 50, ${width * 0.75 - 60} 100`
              : `M ${width * 0.75 - 60} 0 C ${width * 0.75 - 60} 50, ${width * 0.25 + 60} 50, ${width * 0.25 + 60} 100`
          }
          fill="none"
          stroke={Colors.light.gold}
          strokeWidth="2"
          strokeDasharray="5, 5"
        />
        {/* Arrowhead */}
        <Path
          d={
            isLeftToRight
              ? `M ${width * 0.75 - 60} 100 L ${width * 0.75 - 65} 90 L ${width * 0.75 - 55} 90 Z`
              : `M ${width * 0.25 + 60} 100 L ${width * 0.25 + 55} 90 L ${width * 0.25 + 65} 90 Z`
          }
          fill={Colors.light.gold}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    backgroundColor: Colors.light.ivory,
    overflow: "hidden",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.maroon,
    fontFamily: "serif",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.gold,
    marginTop: 5,
    fontStyle: "italic",
  },
  timelineContainer: {
    paddingHorizontal: 0,
  },
  stageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  stageLeft: {
    flexDirection: "row",
  },
  stageRight: {
    flexDirection: "row-reverse",
  },
  contentBox: {
    flex: 1,
    paddingHorizontal: 15,
  },
  alignLeft: {
    alignItems: "flex-start",
    textAlign: "left",
  },
  alignRight: {
    alignItems: "flex-end",
    textAlign: "right",
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.maroon,
    marginBottom: 5,
  },
  stageDescription: {
    fontSize: 12,
    color: Colors.light.text,
    lineHeight: 18,
    opacity: 0.8,
  },
  imageBox: {
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  stageImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.light.gold,
    backgroundColor: Colors.light.ivory,
  },
  connectorContainer: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
