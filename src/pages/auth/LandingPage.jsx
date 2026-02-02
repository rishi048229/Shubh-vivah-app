import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { Colors } from '../../utils/colors';

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
                        source={require('../../assets/auth/haldi_kumkum.png')}
                        style={styles.haldiKumkum}
                        resizeMode="contain"
                    />

                    <Image
                        source={require('../../assets/auth/kalash.png')}
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
        backgroundColor: Colors.background,
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
        width: width * 0.9,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -40, // Pull elements up
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    haldiKumkum: {
        width: 230,
        height: 130,
        marginTop: -30, // Reduced from -60 to move downwards
        zIndex: 11,
    },
    kalash: {
        width: 220,
        height: 280,
        marginTop: -50, // Adjusted to match new Haldi Kumkum position
        marginBottom: -10,
        zIndex: 10,
    },

    dividerImage: {
        width: width * 0.95,
        height: 180,
        marginTop: -70, // Moved more upwards exactly below the Kalash
        marginBottom: 0,
    },
    taglineBox: {
        alignItems: 'center',
        marginTop: -50, // Pull tagline up closer to the divider's center
    },
    mainTagline: {
        fontSize: 18, // Slightly refined
        fontWeight: 'bold',
        color: Colors.primary, // Brand Kumkum Red
        textAlign: 'center',
    },
    subTagline: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 2,
    },
    footer: {
        height: 120, // Increased for even more bottom space
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    scrollIndicator: {
        width: 50,
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
    },
});

export default LandingPage;
