import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../utils/colors';
import Button from '../../components/Button/Button';

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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.mainContent}>
                        {/* Unified Logo & Image Block */}
                        <View style={styles.brandingContainer}>
                            <View style={styles.logoWrapper}>
                                <Image
                                    source={require('../../assets/common/logo_v2.png')}
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
                            <Text style={styles.title}>Choose your preferred Language</Text>
                            <Text style={styles.subtitle}>Please select your language</Text>
                        </View>

                        {/* Language Selection List */}
                        <View style={styles.listContainer}>
                            {languages.map((item) => {
                                const isSelected = selectedLanguage === item.id;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.languageCard}
                                        onPress={() => setSelectedLanguage(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.radioButton,
                                            isSelected && styles.radioButtonSelected
                                        ]}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={[
                                            styles.languageLabel,
                                            isSelected && styles.languageLabelSelected
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Footer Section - Pushed to bottom by flex: 1 in mainContent */}
                    <View style={styles.footer}>
                        <Image
                            source={require('../../assets/auth/landing_divider.png')}
                            style={styles.dividerImage}
                            resizeMode="contain"
                        />

                        <Button
                            title="Save & Continue"
                            onPress={handleContinue}
                            style={styles.buttonContainer}
                        />
                        <View style={styles.bottomBar} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1, // Crucial: allows inner content to fill screen
    },
    mainContent: {
        flex: 1, // Crucial: pushes footer down on large screens
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 0, // Further moved up
    },
    brandingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0, // Removed top margin
        marginBottom: 0, // Removed bottom margin
    },
    logoWrapper: {
        zIndex: 2,
    },
    logo: {
        width: width * 0.9,
        height: 220, // Reduced from 250
    },
    haldiKumkum: {
        width: 260,
        height: 120,
        marginTop: -75, // Pull further up
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 5,
        width: '100%',
        marginTop: 5, // Moved text lower
    },
    title: {
        fontSize: 22,
        fontFamily: 'Outfit_700Bold', // Modern sans-serif bold
        color: Colors.primary,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular', // Modern sans-serif
        color: '#757575',
        textAlign: 'center',
        marginBottom: 10,
    },
    listContainer: {
        width: '100%',
        paddingHorizontal: 4,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20, // Increased space between languages
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    languageLabel: {
        fontSize: 18,
        fontFamily: 'Outfit_500Medium', // Modern sans-serif medium
        color: Colors.text,
        marginLeft: 15,
    },
    languageLabelSelected: {
        color: Colors.primary, // Kumkum Red
        fontWeight: 'bold',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#BDBDBD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: Colors.secondary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 50, // Increased to move everything (button/divider) upwards from the bottom
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
    },
    dividerImage: {
        width: '100%',
        height: 150,
        marginTop: -20, // Moved lower (less overlap with the language list)
        marginBottom: -15, // Sit closer to the Save & Continue button
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 30,
        marginTop: 0, // Managed by divider's marginBottom
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
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
