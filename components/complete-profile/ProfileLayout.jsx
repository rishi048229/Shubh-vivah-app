import { COLORS } from "@/constants/profileConstants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProfileLayout = ({
  title,
  stepTitle,
  currentStep = 1,
  totalSteps = 5,
  onBack,
  onContinue,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const DISPLAY_TOTAL_STEPS = 5;
  const CIRCLE_COUNT = 6;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.stepTitle}>
            Step {currentStep} of {DISPLAY_TOTAL_STEPS} –{" "}
            {stepTitle || "Information"}
          </Text>

          {/* Step Indicators */}
          <View style={styles.indicatorRow}>
            <View style={styles.indicatorLineLeft} />
            <View style={styles.stepContainer}>
              {Array.from({ length: CIRCLE_COUNT }).map((_, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                const isRed = isActive || isCompleted;

                return (
                  <View
                    key={index}
                    style={[
                      styles.stepCircle,
                      isRed
                        ? styles.stepCircleActive
                        : styles.stepCircleInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepText,
                        isRed ? styles.stepTextActive : styles.stepTextInactive,
                      ]}
                    >
                      {stepNum}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.indicatorLineRight} />
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formWrapper}>
          <View style={styles.formBorder}>
            <View style={styles.formContent}>{children}</View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (onContinue) onContinue();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
    marginTop: 4,
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  stepTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    width: width * 0.95,
    alignSelf: "center",
  },
  indicatorLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: "#EDEDED",
    marginRight: 10,
  },
  indicatorLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: "#EDEDED",
    marginLeft: 10,
  },
  stepContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#000",
  },
  stepCircleActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: "#000",
  },
  stepCircleInactive: {
    backgroundColor: "#FFFFF0",
    borderColor: "#000",
  },
  stepText: {
    fontSize: 10,
    fontWeight: "600",
  },
  stepTextActive: {
    color: "#FFF",
  },
  stepTextInactive: {
    color: "#666",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formWrapper: {
    padding: 14,
    paddingBottom: 88,
  },
  formBorder: {
    borderWidth: 0,
    borderRadius: 22,
    paddingBottom: 20,
    backgroundColor: "#FFFFF0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  formContent: {
    padding: 16,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    paddingTop: 10,
  },
  continueButton: {
    width: width * 0.85,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  continueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default ProfileLayout;
