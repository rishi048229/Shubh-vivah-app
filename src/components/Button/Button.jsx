import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../utils/colors';

const Button = ({ title, onPress, isLoading, disabled, style }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[styles.container, style]}
        >
            <LinearGradient
                colors={disabled ? [Colors.border, Colors.border] : Colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <Text style={styles.text}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 3,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    gradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default Button;
