import ProfileLayout from "@/components/complete-profile/ProfileLayout";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/Colors";

const COLORS = {
  PRIMARY: Colors.light.maroon,
};

const EATING_HABITS = ["Vegetarian", "Eggetarian", "Non Vegetarian"];
const DIET_PREFERENCES = ["Vegan", "Jain"];
const DRINKING_OPTIONS = ["No", "Yes", "Occasionally"];
const SMOKING_OPTIONS = ["No", "Yes", "Occasionally"];

interface PillOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  error?: string;
}

interface OptionGroupProps {
  options: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
  error?: string;
}

const LifestyleHabits = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eatingHabits: "",
    dietPreference: "",
    drinking: "",
    smoking: "",
    healthNotes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isFocused, setIsFocused] = useState(false);

  const handleFinish = () => {
    const { eatingHabits, dietPreference, drinking, smoking } = formData;
    const newErrors: Record<string, string> = {};

    if (!eatingHabits)
      newErrors.eatingHabits = "Please select your eating habits";
    // other validations

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    router.push("/complete-profile/profile-completed");
  };

  const PillOption = ({
    label,
    isSelected,
    onPress,
    error,
  }: PillOptionProps) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        isSelected && styles.pillSelected,
        error && { borderColor: "#FF0000" },
      ]}
    >
      <View
        style={[
          styles.radio,
          isSelected && styles.radioSelected,
          error && { borderColor: "#FF0000" },
        ]}
      >
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text
        style={[
          styles.pillText,
          isSelected && styles.pillTextSelected,
          error && { color: "#FF0000" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const OptionGroup = ({
    options,
    selectedValue,
    onSelect,
    error,
  }: OptionGroupProps) => (
    <View>
      <View style={[styles.optionsRow]}>
        {options.map((option) => (
          <PillOption
            key={option}
            label={option}
            isSelected={selectedValue === option}
            onPress={() => onSelect(option)}
            error={error}
          />
        ))}
      </View>
      {error && (
        <Text style={{ color: "#FF0000", fontSize: 12, marginTop: 5 }}>
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <ProfileLayout
      title="Add Lifestyle Habits"
      stepTitle="Lifestyle Habits"
      currentStep={5}
      totalSteps={5}
      onBack={() => router.back()}
      onContinue={handleFinish}
    >
      <View style={styles.content}>
        {/* Eating Habits */}
        <View style={styles.section}>
          <Text style={styles.label}>Eating Habits</Text>
          <View style={styles.optionsContainer}>
            <OptionGroup
              options={EATING_HABITS}
              selectedValue={formData.eatingHabits}
              onSelect={(val) => {
                setFormData({ ...formData, eatingHabits: val });
                if (errors.eatingHabits)
                  setErrors({ ...errors, eatingHabits: "" });
              }}
              error={errors.eatingHabits}
            />
          </View>
        </View>

        {/* Diet Preference */}
        <View style={styles.section}>
          <Text style={styles.label}>Diet Preference</Text>
          <View style={styles.optionsContainer}>
            <OptionGroup
              options={DIET_PREFERENCES}
              selectedValue={formData.dietPreference}
              onSelect={(val) => {
                setFormData({ ...formData, dietPreference: val });
                if (errors.dietPreference)
                  setErrors({ ...errors, dietPreference: "" });
              }}
              error={errors.dietPreference}
            />
          </View>
        </View>

        {/* Drinking */}
        <View style={styles.section}>
          <Text style={styles.label}>Drinking</Text>
          <View style={styles.optionsContainer}>
            <OptionGroup
              options={DRINKING_OPTIONS}
              selectedValue={formData.drinking}
              onSelect={(val) => {
                setFormData({ ...formData, drinking: val });
                if (errors.drinking) setErrors({ ...errors, drinking: "" });
              }}
              error={errors.drinking}
            />
          </View>
        </View>

        {/* Smoking */}
        <View style={styles.section}>
          <Text style={styles.label}>Smoking</Text>
          <View style={styles.optionsContainer}>
            <OptionGroup
              options={SMOKING_OPTIONS}
              selectedValue={formData.smoking}
              onSelect={(val) => {
                setFormData({ ...formData, smoking: val });
                if (errors.smoking) setErrors({ ...errors, smoking: "" });
              }}
              error={errors.smoking}
            />
          </View>
        </View>

        {/* Health Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Health Notes <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <View
            style={[
              styles.optionsContainer,
              (isFocused || !!formData.healthNotes) && {
                borderColor: COLORS.PRIMARY,
              },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                !!formData.healthNotes && { color: COLORS.PRIMARY },
              ]}
              placeholder="Any lifestyle related condition?"
              placeholderTextColor="#999"
              value={formData.healthNotes}
              onChangeText={(text) =>
                setFormData({ ...formData, healthNotes: text })
              }
              multiline
              numberOfLines={4}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>
      </View>
    </ProfileLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  optional: {
    fontWeight: "400",
    fontSize: 11,
    color: "#999",
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: "#E5D9C5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFF0",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFF0",
    borderWidth: 1,
    borderColor: "#D4C4B0",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pillSelected: {
    borderColor: COLORS.PRIMARY,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: COLORS.PRIMARY,
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PRIMARY,
  },
  pillText: {
    fontSize: 14,
    color: "#333",
  },
  pillTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  textInput: {
    textAlignVertical: "top",
    fontSize: 14,
    color: "#333",
  },
});

export default LifestyleHabits;
