import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';
import { Eye, EyeOff } from 'lucide-react-native';

const Input = ({ label, error, icon, isPassword, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[
                styles.inputContainer,
                isFocused && styles.focused,
                !!error && styles.errorBorder
            ]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.placeholder}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        {showPassword ? <EyeOff size={20} color={Colors.subtext} /> : <Eye size={20} color={Colors.subtext} />}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { marginBottom: 6, fontSize: 14, color: Colors.text, fontWeight: '500' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    focused: { borderColor: Colors.secondary },
    errorBorder: { borderColor: Colors.error },
    iconContainer: { marginRight: 10 },
    input: { flex: 1, color: Colors.text, fontSize: 16 },
    eyeIcon: { padding: 4 },
    errorText: { color: Colors.error, fontSize: 12, marginTop: 4 },
});

export default Input;
