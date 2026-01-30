import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileFormModalProps {
  visible: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Personal & Lifestyle" },
  { id: 3, title: "Family & Background" },
  { id: 4, title: "Partner Preferences" },
];

export const ProfileFormModal = ({
  visible,
  onClose,
}: ProfileFormModalProps) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <InputGroup label="Full Name" placeholder="Enter your full name" />
            <InputGroup label="Date of Birth" placeholder="DD/MM/YYYY" />
            <InputGroup label="Gender" placeholder="Select Gender" />
            <InputGroup label="Height" placeholder={"e.g. 5'10\""} />
            <InputGroup label="Marital Status" placeholder="Select Status" />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <InputGroup label="Education" placeholder="Highest Qualification" />
            <InputGroup label="Profession" placeholder="Current Job Title" />
            <InputGroup label="Annual Income" placeholder="Select Range" />
            <InputGroup label="Diet" placeholder="Veg / Non-Veg / Vegan" />
            <InputGroup
              label="Smoking / Drinking"
              placeholder="Select Habits"
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <InputGroup label="Religion" placeholder="Select Religion" />
            <InputGroup label="Community" placeholder="Select Community" />
            <InputGroup label="Mother Tongue" placeholder="Select Language" />
            <InputGroup label="Family Type" placeholder="Nuclear / Joint" />
            <InputGroup label="City / State" placeholder="Current Location" />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <InputGroup
              label="Preferred Age Range"
              placeholder="e.g. 24 - 29"
            />
            <InputGroup
              label="Preferred Location"
              placeholder="Any / Specific City"
            />
            <InputGroup label="Community Preference" placeholder="Same / Any" />
            <InputGroup
              label="Lifestyle Preference"
              placeholder="Select Preferences"
            />
          </View>
        );
      default:
        return null;
    }
  };

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
          <Text style={styles.headerTitle}>Complete Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressHeader}>
          <Text style={styles.stepText}>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentStep / STEPS.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Form Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            key={currentStep}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentStep === STEPS.length ? "Finish" : "Next"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={Colors.light.gold}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const InputGroup = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
    />
  </View>
);

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
  progressHeader: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.maroon,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.light.maroon,
    borderRadius: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    padding: 20,
    flexDirection: "row",
    gap: 15,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.light.maroon,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.gold,
  },
});
