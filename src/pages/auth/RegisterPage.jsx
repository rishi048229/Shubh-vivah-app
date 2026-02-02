import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Dimensions,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colors';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { Mail, Lock, CheckCircle2, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPasswordError } from '../../utils/validators';

const { width } = Dimensions.get('window');

const RegisterPage = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState('request'); // request, verify, verified_success, register_password, register_success
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const otpInputs = useRef([]);

    const handleSendOtp = () => {
        if (!identifier) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('verify');
        }, 1500);
    };

    const handleVerifyOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('verified_success');
        }, 1500);
    };

    const handleRegister = () => {
        const passwordError = getPasswordError(password);
        if (passwordError) {
            setErrors({ password: passwordError });
            return;
        }
        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords don't match" });
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('register_success');
        }, 1500);
    };

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleOtpKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const renderHeader = () => (
        <View style={styles.logoSection}>
            <Image
                source={require('../../assets/common/logo_v2.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Image
                source={require('../../assets/auth/haldi_kumkum.png')}
                style={styles.haldiKumkum}
                resizeMode="contain"
            />
        </View>
    );



    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainContent}>
                        {renderHeader()}

                        <View style={styles.formSection}>
                            {step === 'request' && (
                                <>
                                    <View style={styles.textCenter}>
                                        <Text style={styles.title}>Create New Account</Text>
                                        <Text style={styles.subtitle}>Enter your registered email or mobile number</Text>
                                    </View>
                                    <Input
                                        placeholder="Email / Mobile"
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                        icon={<Mail size={20} color={Colors.subtext} />}
                                    />
                                    <Button
                                        title="Send OTP"
                                        onPress={handleSendOtp}
                                        isLoading={isLoading}
                                        style={styles.actionBtn}
                                    />
                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Already have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                            <Text style={styles.loginText}>Log in</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {step === 'verify' && (
                                <>
                                    <View style={styles.textCenter}>
                                        <Text style={styles.title}>Verify OTP</Text>
                                        <Text style={styles.subtitle}>We have sent a 6-digit code to{"\n"}{identifier}</Text>
                                    </View>
                                    <View style={styles.otpContainer}>
                                        {otp.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={(input) => (otpInputs.current[index] = input)}
                                                style={styles.otpInput}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                value={digit}
                                                onChangeText={(value) => handleOtpChange(value, index)}
                                                onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                            />
                                        ))}
                                    </View>
                                    <Button
                                        title="Verify"
                                        onPress={handleVerifyOtp}
                                        isLoading={isLoading}
                                        style={styles.actionBtn}
                                    />
                                    <TouchableOpacity style={styles.backLink}>
                                        <Text style={styles.backLinkText}>Resend Code</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {step === 'verified_success' && (
                                <>
                                    <View style={styles.successIconContainer}>
                                        <View style={styles.circleCheck}>
                                            <Check size={40} color="#FFF" strokeWidth={3} />
                                        </View>
                                    </View>
                                    <View style={styles.textCenter}>
                                        <Text style={[styles.title, styles.boldTitle]}>OTP Verified Successfully</Text>
                                        <Text style={styles.subtitle}>You can now set your account password</Text>
                                    </View>
                                    <Button
                                        title="Continue"
                                        onPress={() => setStep('register_password')}
                                        style={[styles.actionBtn, { width: '50%' }]}
                                    />
                                </>
                            )}

                            {step === 'register_password' && (
                                <>
                                    <View style={styles.textCenter}>
                                        <Text style={styles.title}>Create Password</Text>
                                    </View>
                                    <Input
                                        placeholder="Enter new password"
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setErrors({ ...errors, password: undefined });
                                        }}
                                        icon={<Lock size={20} color={Colors.subtext} />}
                                        isPassword
                                        error={errors.password}
                                    />
                                    <Input
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            setErrors({ ...errors, confirmPassword: undefined });
                                        }}
                                        icon={<Lock size={20} color={Colors.subtext} />}
                                        isPassword
                                        error={errors.confirmPassword}
                                    />
                                    <Button
                                        title="Create Account"
                                        onPress={handleRegister}
                                        isLoading={isLoading}
                                        style={styles.actionBtn}
                                    />
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backLink}>
                                        <Text style={styles.backLinkText}>Back to login</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {step === 'register_success' && (
                                <>
                                    <View style={styles.successIconContainer}>
                                        <View style={styles.circleCheck}>
                                            <Check size={40} color="#FFF" strokeWidth={3} />
                                        </View>
                                    </View>
                                    <View style={styles.textCenter}>
                                        <Text style={[styles.title, styles.boldTitle]}>Account created successfully</Text>
                                        <Text style={styles.subtitle}>Log in now with your new password</Text>
                                    </View>
                                    <Button
                                        title="Back to login"
                                        onPress={() => navigation.navigate('Login')}
                                        style={[styles.actionBtn, { width: '50%' }]}
                                    />
                                </>
                            )}
                        </View>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.bottomSection}>
                        <Image
                            source={require('../../assets/auth/landing_divider.png')}
                            style={styles.dividerImage}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 10, paddingBottom: 25 },
    mainContent: { flex: 1 },
    logoSection: { alignItems: 'center', marginBottom: 5 },
    logo: { width: width * 0.85, height: 180 },
    haldiKumkum: { width: 240, height: 100, marginTop: -50, zIndex: 10 },
    formSection: { width: '100%', alignItems: 'center', marginTop: 10 },
    textCenter: { alignItems: 'center', marginBottom: 25 },
    boldTitle: { fontWeight: '700' },
    title: { fontSize: 24, fontWeight: '400', color: Colors.text, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 20 },
    actionBtn: { width: '65%', alignSelf: 'center', marginBottom: 20, borderRadius: 30, backgroundColor: Colors.primary },
    backLink: { paddingVertical: 10, width: '100%', alignItems: 'center' },
    backLinkText: { color: '#757575', fontSize: 14, fontWeight: '500' },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 30 },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    successIconContainer: { marginBottom: 25, alignItems: 'center' },
    circleCheck: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    dividerImage: { width: '100%', height: 180, alignSelf: 'center', marginTop: -100, marginBottom: 10 },
    bottomSection: { width: '100%', alignItems: 'center', paddingBottom: 15 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 5 },
    footerText: { fontSize: 14, color: '#757575' },
    loginText: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
});

export default RegisterPage;
