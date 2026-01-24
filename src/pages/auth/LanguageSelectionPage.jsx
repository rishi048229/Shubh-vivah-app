import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LanguageSelectionPage = ({ navigation }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const languages = [
        { id: 'en', label: 'English', native: 'English' },
        { id: 'hi', label: 'हिंदी', native: 'Hindi' },
        { id: 'mr', label: 'मराठी', native: 'Marathi' },
    ];

    const handleContinue = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Unified Logo & Image Block */}
                <View style={styles.brandingContainer}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../../assets/common/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Image
                        source={require('../../assets/auth/haldi_kumkum.png')}
                        style={styles.haldiKumkum}
                        resizeMode="contain"
                    />
                </View>

                {/* Header Text */}
                <View style={styles.header}>
                    <Text style={styles.title}>Choose your preferred language</Text>
                    <Text style={styles.subtitle}>Please select your language</Text>
                </View>

                {/* Language Selection List */}
                <View style={styles.listContainer}>
                    {languages.map((item) => {
                        const isSelected = selectedLanguage === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.languageCard,
                                    isSelected && styles.languageCardSelected
                                ]}
                                onPress={() => setSelectedLanguage(item.id)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.languageInfo}>
                                    <Text style={[
                                        styles.languageLabel,
                                        isSelected && styles.languageLabelSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={styles.languageNative}>
                                        {item.native}
                                    </Text>
                                </View>

                                <View style={[
                                    styles.radioButton,
                                    isSelected && styles.radioButtonSelected
                                ]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Footer with Traditional Elements */}
            <View style={styles.footer}>
                {/* Decorative Divider */}
                <View style={styles.dividerBox}>
                    <View style={styles.goldenLine} />
                    <View style={styles.ornamentGroup}>
                        <View style={styles.smallDot} />
                        <View style={styles.goldDiamond} />
                        <View style={styles.smallDot} />
                    </View>
                    <View style={styles.goldenLine} />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Save & Continue</Text>
                </TouchableOpacity>
                <View style={styles.bottomBar} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite || '#FFFDF5', // Fallback if undefined
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    brandingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.05,
        marginBottom: 30,
        // Ensures the block feels unified
    },
    logoWrapper: {
        // Wrapper to control logo positioning relative to haldi kumkum
        zIndex: 2, // Place logo visually above if needed, or below. Usually logo is top.
    },
    logo: {
        width: width * 0.65,
        height: 100,
    },
    haldiKumkum: {
        width: 160,
        height: 60,
        marginTop: -25, // Negative margin to create the overlap/connected feel
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold', // heavy bold
        color: Colors.maroon || '#560319',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.subtext,
        fontWeight: '400',
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        paddingHorizontal: 4,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'transparent',
        // Shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    languageCardSelected: {
        borderColor: Colors.gold || '#D4AF37',
        backgroundColor: '#FFFBF0', // Very subtle gold tint
        borderWidth: 1.5,
    },
    languageInfo: {
        flexDirection: 'column',
    },
    languageLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    languageLabelSelected: {
        color: Colors.maroon || '#560319',
        fontWeight: '700',
    },
    languageNative: {
        fontSize: 13,
        color: Colors.subtext,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#BDBDBD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: Colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        width: '100%',
        alignItems: 'center',
    },
    dividerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 25,
        opacity: 0.8,
    },
    goldenLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.gold || '#D4AF37',
    },
    ornamentGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    smallDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.gold || '#D4AF37',
        marginHorizontal: 3,
    },
    goldDiamond: {
        width: 6,
        height: 6,
        backgroundColor: Colors.maroon || '#560319',
        transform: [{ rotate: '45deg' }],
        marginHorizontal: 4,
    },
    button: {
        width: '100%',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    bottomBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginTop: 20,
    },
});

export default LanguageSelectionPage;
