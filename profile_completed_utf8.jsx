import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS } from './constants';

const { width } = Dimensions.get('window');

const ProfileCompleted = ({ navigation }) => {
    const handleProceedToKYC = () => {
        // Navigation to KYC screen - placeholder as Kyoto screen might be implemented later
        navigation.navigate('KYC');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Top Logo */}
                <Image
                    source={require('../../assets/common/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.contentContainer}>
                    {/* Success Check Icon */}
                    <View style={styles.iconCircle}>
                        <Check color="#FFFFFF" size={35} strokeWidth={3} />
                    </View>

                    {/* Text Section */}
                    <View style={styles.textSection}>
                        <Text style={styles.heading}>Profile Completed</Text>
                        <Text style={styles.subtext}>For further process complete your KYC</Text>
                    </View>

                    {/* Main Button - Moved inside contentContainer to be close to text */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleProceedToKYC}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Proceed to KYC</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        paddingTop: 70, // Adjusted downward slightly
    },
    logo: {
        width: width * 1.2, // Scaled up even more
        height: 250, // Massive height
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -270, // Adjusted downward slightly
    },
    iconCircle: {
        width: 65, // Reduced size even more
        height: 65, // Reduced size even more
        borderRadius: 32.5,
        backgroundColor: COLORS.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70, // Increased to move text and button downward
        // Elevation for premium look
        elevation: 8,
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    textSection: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Outfit_700Bold',
    },
    subtext: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'Outfit_500Medium',
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        width: width * 0.75, // Adjusted length
        height: 44, // Decreased height further
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15, // Moved further upward closer to text
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
});

export default ProfileCompleted;
