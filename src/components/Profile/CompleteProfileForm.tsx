import DateTimePicker from "@react-native-community/datetimepicker";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    Minus,
    Plus,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==========================================
// 1. CONSTANTS
// ==========================================

export const COLORS = {
  BACKGROUND: "#FFFFF0",
  PRIMARY: "#800000",
  GOLD: "#D4AF37",
  TEXT: "#333333",
  INPUT_BG: "#FFFFF0",
  BORDER: "#E0E0E0",
  PLACEHOLDER: "#999999",
};

export const GLOBAL_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: COLORS.TEXT,
    textAlign: "center" as const,
    marginVertical: 10,
  },
};

const { width } = Dimensions.get("window");

// ==========================================
// 2. PROFILE LAYOUT COMPONENT
// ==========================================

interface ProfileLayoutProps {
  title: string;
  stepTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  onBack: () => void;
  onContinue?: () => void;
  children: React.ReactNode;
}

export const ProfileLayout = ({
  title,
  stepTitle,
  currentStep = 1,
  totalSteps = 5,
  onBack,
  onContinue,
  children,
}: ProfileLayoutProps) => {
  const insets = useSafeAreaInsets();
  const DISPLAY_TOTAL_STEPS = 5;
  const CIRCLE_COUNT = 6;

  return (
    <View style={[layoutStyles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={layoutStyles.header}>
        <TouchableOpacity onPress={onBack} style={layoutStyles.backButton}>
          <ArrowLeft size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <View style={layoutStyles.titleContainer}>
          <Text style={layoutStyles.title}>{title}</Text>

          <Text style={layoutStyles.stepTitle}>
            Step {currentStep} of {DISPLAY_TOTAL_STEPS} –{" "}
            {stepTitle || "Information"}
          </Text>

          {/* Step Indicators */}
          <View style={layoutStyles.indicatorRow}>
            <View style={layoutStyles.indicatorLineLeft} />
            <View style={layoutStyles.stepContainer}>
              {Array.from({ length: CIRCLE_COUNT }).map((_, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                const isRed = isActive || isCompleted;

                return (
                  <View
                    key={index}
                    style={[
                      layoutStyles.stepCircle,
                      isRed
                        ? layoutStyles.stepCircleActive
                        : layoutStyles.stepCircleInactive,
                    ]}
                  >
                    <Text
                      style={[
                        layoutStyles.stepText,
                        isRed
                          ? layoutStyles.stepTextActive
                          : layoutStyles.stepTextInactive,
                      ]}
                    >
                      {stepNum}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={layoutStyles.indicatorLineRight} />
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={layoutStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={layoutStyles.formWrapper}>
          <View style={layoutStyles.formBorder}>
            <View style={layoutStyles.formContent}>{children}</View>

            {/* Decorative Divider */}
            <View style={layoutStyles.dividerDecoration} pointerEvents="none">
              <Image
                source={require("@/assets/auth/landing_divider.png")}
                style={layoutStyles.dividerImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View
        style={[
          layoutStyles.bottomSection,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <TouchableOpacity
          style={layoutStyles.continueButton}
          onPress={() => {
            if (onContinue) onContinue();
          }}
          activeOpacity={0.9}
        >
          <Text style={layoutStyles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const layoutStyles = StyleSheet.create({
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
    fontFamily: "Outfit_700Bold",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: "Outfit_500Medium",
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
    fontFamily: "Outfit_600SemiBold",
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
  dividerDecoration: {
    position: "absolute",
    bottom: -108,
    alignSelf: "center",
    width: width * 2.1,
    height: width * 2.1 * 0.28,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerImage: {
    width: "100%",
    height: "100%",
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
    fontFamily: "Outfit_700Bold",
    letterSpacing: 0.5,
  },
});

// ==========================================
// 3. FORM CONTROLS
// ==========================================

export const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default" as any,
  error,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={formStyles.inputContainer}>
      {label && <Text style={formStyles.label}>{label}</Text>}
      <View
        style={[
          formStyles.inputWrapper,
          (isFocused || value) && { borderColor: COLORS.PRIMARY },
          error && { borderColor: "#FF0000" },
        ]}
      >
        <TextInput
          style={[
            formStyles.input,
            value && { color: COLORS.PRIMARY },
            error && { color: "#FF0000" },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.PLACEHOLDER}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
};

export const CustomDropdown = ({ label, value, placeholder, onPress }: any) => (
  <View style={formStyles.inputContainer}>
    {label && <Text style={formStyles.label}>{label}</Text>}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        formStyles.inputWrapper,
        value && { borderColor: COLORS.PRIMARY },
      ]}
    >
      <Text
        style={[
          formStyles.input,
          value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER },
        ]}
      >
        {value || placeholder}
      </Text>
      <ChevronDown
        size={20}
        color={value ? COLORS.PRIMARY : COLORS.PLACEHOLDER}
      />
    </TouchableOpacity>
  </View>
);

export const CustomModalDropdown = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  error,
}: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={formStyles.inputContainer}>
      {label && <Text style={formStyles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={[
          formStyles.inputWrapper,
          value && { borderColor: COLORS.PRIMARY },
          error && { borderColor: "#FF0000" },
        ]}
      >
        <Text
          style={[
            formStyles.input,
            value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER },
            error && { color: "#FF0000" },
          ]}
        >
          {value || placeholder}
        </Text>
        <ChevronDown
          size={20}
          color={
            error ? "#FF0000" : value ? COLORS.PRIMARY : COLORS.PLACEHOLDER
          }
        />
      </TouchableOpacity>
      {error && <Text style={formStyles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={formStyles.modalOverlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={formStyles.modalContent}>
            <View style={formStyles.modalHeader}>
              <Text style={formStyles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item: string) => item.toString()}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={formStyles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      formStyles.modalItemText,
                      item === value && formStyles.modalItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && <Check size={20} color={COLORS.PRIMARY} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const CustomDateInput = ({ label, value, onChange, error }: any) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      const formatted = `${day}/${month}/${year}`;
      onChange(formatted);
    }
  };

  return (
    <View style={formStyles.inputContainer}>
      {label && <Text style={formStyles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowPicker(true)}
        style={[
          formStyles.inputWrapper,
          value && { borderColor: COLORS.PRIMARY },
          error && { borderColor: "#FF0000" },
        ]}
      >
        <Text
          style={[
            formStyles.input,
            value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER },
            error && { color: "#FF0000" },
          ]}
        >
          {value || "DD/MM/YYYY"}
        </Text>
        <ChevronDown
          size={20}
          color={
            error ? "#FF0000" : value ? COLORS.PRIMARY : COLORS.PLACEHOLDER
          }
        />
      </TouchableOpacity>
      {error && <Text style={formStyles.errorText}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export const RadioGroup = ({
  label,
  options = [],
  selectedOption,
  onSelect,
  horizontal = true,
  error,
}: any) => (
  <View style={formStyles.inputContainer}>
    {label && <Text style={formStyles.label}>{label}</Text>}
    <View
      style={[
        formStyles.radioGroup,
        horizontal ? formStyles.row : formStyles.column,
      ]}
    >
      {options.map((option: string) => (
        <TouchableOpacity
          key={option}
          activeOpacity={0.8}
          style={formStyles.radioButton}
          onPress={() => onSelect(option)}
        >
          {selectedOption === option ? (
            <View style={formStyles.radioSelected}>
              <View style={formStyles.radioInner} />
            </View>
          ) : (
            <View
              style={[
                formStyles.radioUnselected,
                error && { borderColor: "#FF0000" },
              ]}
            />
          )}
          <Text
            style={[
              formStyles.radioText,
              selectedOption === option && {
                color: COLORS.PRIMARY,
                fontWeight: "600" as const,
              },
              error && !selectedOption && { color: "#FF0000" },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {error && <Text style={formStyles.errorText}>{error}</Text>}
  </View>
);

export const CustomPhoneInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    onChangeText(cleaned.slice(0, 10));
  };

  return (
    <View style={formStyles.inputContainer}>
      {label && <Text style={formStyles.label}>{label}</Text>}
      <View
        style={[
          formStyles.inputWrapper,
          (isFocused || (value && value.length === 10)) && {
            borderColor: COLORS.PRIMARY,
          },
          error && { borderColor: "#FF0000" },
        ]}
      >
        <View style={formStyles.phonePrefixContainer}>
          <Text
            style={[
              formStyles.phonePrefixText,
              (isFocused || value) && { color: COLORS.PRIMARY },
              error && { color: "#FF0000" },
            ]}
          >
            +91
          </Text>
          <View
            style={[
              formStyles.phoneDivider,
              (isFocused || value) && { backgroundColor: COLORS.PRIMARY },
              error && { backgroundColor: "#FF0000" },
            ]}
          />
        </View>
        <TextInput
          style={[
            formStyles.input,
            value && { color: COLORS.PRIMARY },
            error && { color: "#FF0000" },
          ]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.PLACEHOLDER}
          keyboardType="phone-pad"
          maxLength={10}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
};

export const Counter = ({ label, value, onIncrement, onDecrement }: any) => (
  <View style={formStyles.inputContainer}>
    {label && <Text style={formStyles.label}>{label}</Text>}
    <View
      style={[
        formStyles.counterWrapper,
        value > 0 && { borderColor: COLORS.PRIMARY },
      ]}
    >
      <TouchableOpacity onPress={onDecrement} style={formStyles.counterBtn}>
        <Minus size={20} color={COLORS.TEXT} />
      </TouchableOpacity>
      <Text style={formStyles.counterValue}>{value}</Text>
      <TouchableOpacity onPress={onIncrement} style={formStyles.counterBtn}>
        <Plus size={20} color={COLORS.TEXT} />
      </TouchableOpacity>
    </View>
  </View>
);

const formStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT,
    fontFamily: "Outfit_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    maxHeight: "60%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.TEXT,
    fontFamily: "Outfit_700Bold",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontFamily: "Outfit_400Regular",
  },
  modalItemTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  radioGroup: {
    flexWrap: "wrap",
    gap: 15,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 8,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
  },
  radioText: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  counterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    height: 44,
    width: 150,
    justifyContent: "space-between",
    paddingHorizontal: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  counterBtn: {
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  counterValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT,
    fontFamily: "Outfit_600SemiBold",
  },
  phonePrefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  phonePrefixText: {
    fontSize: 14,
    color: COLORS.PLACEHOLDER,
    fontFamily: "Outfit_500Medium",
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.BORDER,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 11,
    color: "#FF0000",
    marginTop: 4,
    marginLeft: 2,
    fontFamily: "Outfit_400Regular",
  },
});
