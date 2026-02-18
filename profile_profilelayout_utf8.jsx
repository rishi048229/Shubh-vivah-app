import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

const ProfileLayout = ({ title, stepTitle, currentStep = 1, totalSteps = 5, onBack, onContinue, children }) => {
    const insets = useSafeAreaInsets();
    const DISPLAY_TOTAL_STEPS = 5;
    const CIRCLE_COUNT = 6;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.stepTitle}>
                        Step {currentStep} of {DISPLAY_TOTAL_STEPS} ΓÇô {stepTitle || 'Information'}
                    </Text>

                    {/* Step Indicators */}
                    <View style={styles.indicatorRow}>
                        <View style={styles.indicatorLineLeft} />
                        <View style={styles.stepContainer}>
                            {Array.from({ length: CIRCLE_COUNT }).map((_, index) => {
                                const stepNum = index + 1;
                                const isActive = stepNum === currentStep;
                                const isCompleted = stepNum < currentStep;
                                const isRed = isActive || isCompleted;

                                return (
                                    <View
                                        key={index}
                                        style={[
                                            styles.stepCircle,
                                            isRed ? styles.stepCircleActive : styles.stepCircleInactive
                                        ]}
                                    >
                                        <Text style={[
                                            styles.stepText,
                                            isRed ? styles.stepTextActive : styles.stepTextInactive
                                        ]}>
                                            {stepNum}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.indicatorLineRight} />
                    </View>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formWrapper}>
                    <View style={styles.formBorder}>
                        <View style={styles.formContent}>
                            {children}
                        </View>

                        {/* Decorative Divider Decoration */}
                        <View style={styles.dividerDecoration} pointerEvents="none">
                            <Image
                                source={require('../../../assets/auth/landing_divider.png')}
                                style={styles.dividerImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Section */}
            <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
                {/* Decorative Golden Line - Hidden as we use the overlapping divider now */}
                {/* <View style={styles.decorativeLineContainer}>
                    <View style={styles.decorativeLine} />
                    <View style={styles.decorativeDiamond} />
                    <View style={styles.decorativeLine} />
                </View> */}

                {/* Continue Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => {
                        console.log('Continue button pressed in ProfileLayout');
                        if (onContinue) onContinue();
                    }}
                    activeOpacity={0.9}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
        marginTop: 4,
    },
    titleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Outfit_700Bold',
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    stepTitle: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: '#666',
        marginBottom: 12,
    },
    indicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        width: width * 0.95, // Stretch almost to full screen width
        alignSelf: 'center',
    },
    indicatorLineLeft: {
        flex: 1,
        height: 1,
        backgroundColor: '#EDEDED', // Lighter subtle gray/beige
        marginRight: 10,
    },
    indicatorLineRight: {
        flex: 1,
        height: 1,
        backgroundColor: '#EDEDED',
        marginLeft: 10,
    },
    stepContainer: {
        flexDirection: 'row',
        gap: 4, // More closer spacing
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: '#000', // Black border for all circles
    },
    stepCircleActive: {
        backgroundColor: COLORS.PRIMARY,
        borderColor: '#000', // Keep black border even when active
    },
    stepCircleInactive: {
        backgroundColor: '#FFFFF0', // Ivory background for inactive steps
        borderColor: '#000', // Keep black border
    },
    stepText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
    stepTextActive: {
        color: '#FFF',
    },
    stepTextInactive: {
        color: '#666',
    },
    scrollContent: {
        flexGrow: 1,
    },
    formWrapper: {
        padding: 14,
        paddingBottom: 88, // Space for bottom fixed section
    },
    formBorder: {
        borderWidth: 0,
        borderRadius: 22,
        paddingBottom: 20,
        backgroundColor: '#FFFFF0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 20,
    },
    formContent: {
        padding: 16,
    },
    dividerDecoration: {
        position: 'absolute',
        bottom: -108,
        alignSelf: 'center',
        width: width * 2.1, // Colossal width (210%) maintained
        height: (width * 2.1) * 0.28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dividerImage: {
        width: '100%',
        height: '100%',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.BACKGROUND,
        alignItems: 'center',
        paddingTop: 10,
    },
    decorativeLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 15,
        opacity: 0.8,
    },
    decorativeLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.GOLD,
    },
    decorativeDiamond: {
        width: 8,
        height: 8,
        backgroundColor: COLORS.GOLD,
        transform: [{ rotate: '45deg' }],
        marginHorizontal: 10,
    },
    continueButton: {
        width: width * 0.85,
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    continueText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
});

export default ProfileLayout;
