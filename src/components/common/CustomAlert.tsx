import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CheckCircle2, AlertCircle, Info } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

interface CustomAlertProps {
    visible: boolean;
    type?: "success" | "error" | "info";
    title: string;
    message: string;
    onClose: () => void;
    confirmText?: string;
}

export default function CustomAlert({
    visible,
    type = "info",
    title,
    message,
    onClose,
    confirmText = "Okay",
}: CustomAlertProps) {
    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={48} color="#10B981" strokeWidth={2} />;
            case "error":
                return <AlertCircle size={48} color="#EF4444" strokeWidth={2} />;
            default:
                return <Info size={48} color={Colors.primary} strokeWidth={2} />;
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <View style={styles.iconContainer}>{getIcon()}</View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    alertBox: {
        width: "100%",
        maxWidth: 320,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
        textAlign: "center",
        fontFamily: "Outfit_700Bold",
    },
    message: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
        fontFamily: "Outfit_400Regular",
    },
    button: {
        width: "100%",
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Outfit_600SemiBold",
    },
});
