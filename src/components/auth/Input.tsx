import { Colors } from "@/constants/Colors";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactElement;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          !!error && styles.errorBorder,
          { backgroundColor: isFocused ? "#FFF" : Colors.inputBackground },
        ]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
              color: Colors.primary,
            })}
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.primary} />
            ) : (
              <Eye size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 8, width: "100%" },
  label: {
    marginBottom: 2,
    fontSize: 13,
    color: Colors.text,
    fontFamily: "Outfit_500Medium",
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 25,
    paddingHorizontal: 18,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  focused: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF",
  },
  errorBorder: { borderColor: Colors.error },
  iconContainer: { marginRight: 12 },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Outfit_400Regular",
    height: "100%",
  },
  eyeIcon: { padding: 4 },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4, marginLeft: 5 },
});

export default Input;
