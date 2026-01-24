import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { Colors } from '../../utils/colors';
import GoldenDivider from '../../components/GoldenDivider';

const { width, height } = Dimensions.get('window');

const LandingPage = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        // Auto transition to Language Selection after 3 seconds
        const timer = setTimeout(() => {
            navigation.navigate('LanguageSelection');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.brandingStack}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/common/logo_v2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Image
                        source={require('../../assets/auth/haldi_kumkum_v2.png')}
                        style={styles.haldiKumkum}
                        resizeMode="contain"
                    />

                    <Image
                        source={require('../../assets/auth/landing_kalash_final.png')}
                        style={styles.kalash}
                        resizeMode="contain"
                    />
                </View>

                {/* Divider */}
                <Image
                    source={require('../../assets/auth/landing_divider.png')}
                    style={styles.dividerImage}
                    resizeMode="contain"
                />

                {/* Tagline */}
                <View style={styles.taglineBox}>
                    <Text style={styles.mainTagline}>Trusted Indian Matrimony</Text>
                    <Text style={styles.subTagline}>For Self & Family</Text>
                </View>
            </Animated.View>

            {/* Bottom Progress Bar */}
            <View style={styles.footer}>
                <View style={styles.scrollIndicator} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center', // Center content vertically like in screenshot
    },
    brandingStack: {
        alignItems: 'center',
        width: '100%',
        // marginTop: 40, // Removed top margin to allow center justification
    },
    logoContainer: {
        width: width * 0.8,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -20, // Pull Haldi up closer to Logo
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    // harmonyHubText style removed
    haldiKumkum: {
        width: 180,
        height: 70,
        marginTop: 0,
        marginBottom: -20, // Pull Kalash up to overlap slightly
        zIndex: 10,
    },
    kalash: {
        width: 250,
        height: 250,
        marginTop: 0,
    },

    dividerImage: {
        width: width * 0.8,
        height: 50,
        marginVertical: 20,
    },
    taglineBox: {
        alignItems: 'center',
        marginTop: 5,
    },
    mainTagline: {
        fontSize: 18, // Slightly refined
        fontWeight: 'bold',
        color: '#C62828', // Material Red 800
        textAlign: 'center',
    },
    subTagline: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C62828',
        textAlign: 'center',
        marginTop: 2,
    },
    footer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    scrollIndicator: {
        width: 50,
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
    },
});

export default LandingPage;
