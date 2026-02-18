import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Dimensions,
} from 'react-native';
import { COLORS } from './constants';

const { width } = Dimensions.get('window');

const SelectGender = ({ navigation }) => {
    const [selectedGender, setSelectedGender] = useState(null);

    const handleContinue = () => {
        if (!selectedGender) {
            Alert.alert('Attention', 'Please select your gender');
            return;
        }
        navigation.navigate('BasicDetails', { gender: selectedGender === 'male' ? 'Male' : 'Female' });
    };

    const GenderCard = ({ gender, image, label }) => {
        const isSelected = selectedGender === gender;
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isSelected && styles.cardSelected
                ]}
                onPress={() => setSelectedGender(gender)}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={image}
                        style={styles.genderImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerText}>Select Your Gender</Text>

                <View style={styles.cardsContainer}>
                    <GenderCard
                        gender="male"
                        label="Male"
                        image={require('../../assets/auth/boy.png')}
                    />
                    <GenderCard
                        gender="female"
                        label="Female"
                        image={require('../../assets/auth/girl.png')}
                    />
                </View>

                {/* Divider */}
                <Image
                    source={require('../../assets/auth/landing_divider.png')}
                    style={styles.divider}
                    resizeMode="contain"
                />

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedGender && styles.continueButtonDisabled
                    ]}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingTop: 90, // Moved upward as requested
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Outfit_700Bold',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        width: '100%',
        marginBottom: 30,
    },
    card: {
        width: 150, // Slightly decreased for better balance
        height: 160, // Slightly increased to fit the larger circle
        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E6D5B8',
        padding: 15,
        alignItems: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardSelected: {
        borderColor: COLORS.PRIMARY,
        borderWidth: 2,
        // Selection highlight
        backgroundColor: '#FFF9F0',
    },
    imageContainer: {
        width: 75, // Decreased even more
        height: 75, // Decreased even more
        borderRadius: 37.5, // Adjusted for new size
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.GOLD,
        overflow: 'hidden',
    },
    genderImage: {
        width: '100%',
        height: '100%',
    },
    cardLabel: {
        fontSize: 16,
        color: '#555',
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
    cardLabelSelected: {
        color: COLORS.PRIMARY,
    },
    divider: {
        width: '250%',
        height: 180,
        marginBottom: -60,
        marginTop: 110, // Increased even further to move both divider and button down
    },
    continueButton: {
        width: '100%',
        backgroundColor: COLORS.PRIMARY,
        height: 48, // Decreased height
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    continueButtonDisabled: {
        opacity: 0.5,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
});

export default SelectGender;
