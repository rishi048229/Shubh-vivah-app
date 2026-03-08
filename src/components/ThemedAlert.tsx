import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type AlertType = "success" | "error" | "info" | "warning";

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const iconMap: Record<AlertType, { name: string; color: string }> = {
  success: { name: "checkmark-circle", color: "#34C759" },
  error: { name: "close-circle", color: "#FF3B30" },
  info: { name: "information-circle", color: "#007AFF" },
  warning: { name: "warning", color: "#FF9500" },
};

const bgMap: Record<AlertType, string> = {
  success: "#F0FFF4",
  error: "#FFF5F5",
  info: "#F0F7FF",
  warning: "#FFFAF0",
};

export function ThemedAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}: ThemedAlertProps) {
  const icon = iconMap[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(300).springify().damping(14)} style={styles.card}>
          {/* Colored header strip */}
          <View style={[styles.headerStrip, { backgroundColor: icon.color }]} />

          {/* Icon */}
          <View style={[styles.iconCircle, { backgroundColor: bgMap[type] }]}>
            <Ionicons name={icon.name as any} size={36} color={icon.color} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {onConfirm && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: icon.color }]}
              onPress={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/** Convenience hook to manage alert state */
export function useThemedAlert() {
  const [alertState, setAlertState] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
    type: AlertType;
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "info",
    options?: { onConfirm?: () => void; confirmText?: string }
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      type,
      onConfirm: options?.onConfirm,
      confirmText: options?.confirmText,
    });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <ThemedAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      type={alertState.type}
      onClose={hideAlert}
      onConfirm={alertState.onConfirm}
      confirmText={alertState.confirmText || "OK"}
    />
  );

  return { showAlert, hideAlert, AlertComponent };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  card: {
    width: SCREEN_WIDTH - 60,
    backgroundColor: "#FFF",
    borderRadius: 20,
    alignItems: "center",
    paddingBottom: 24,
    overflow: "hidden",

    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  headerStrip: {
    width: "100%",
    height: 5,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
  },
});
