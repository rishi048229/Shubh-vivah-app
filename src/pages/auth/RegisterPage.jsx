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
import { Mail, Lock, CheckCircle2 } from 'lucide-react-native';
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
                source={require('../../assets/common/logo.png')}
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

    const renderDivider = () => (
        <View style={styles.dividerBox}>
            <View style={styles.goldenLine} />
            <View style={styles.ornamentGroup}>
                <View style={styles.smallDot} />
                <View style={styles.goldDiamond} />
                <View style={styles.smallDot} />
            </View>
            <View style={styles.goldenLine} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                                    <Text style={styles.backLinkText}>Recend Code</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {step === 'verified_success' && (
                            <>
                                <View style={styles.successIconContainer}>
                                    <View style={styles.circleCheck}>
                                        <CheckCircle2 size={60} color="#FFF" />
                                    </View>
                                </View>
                                <View style={styles.textCenter}>
                                    <Text style={styles.title}>OTP Verified Successfully</Text>
                                    <Text style={styles.subtitle}>You can now set your account password</Text>
                                </View>
                                <Button
                                    title="Continue"
                                    onPress={() => setStep('register_password')}
                                    style={styles.actionBtn}
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
                                        <CheckCircle2 size={60} color="#FFF" />
                                    </View>
                                </View>
                                <View style={styles.textCenter}>
                                    <Text style={styles.title}>Account created successfully</Text>
                                    <Text style={styles.subtitle}>Log in now with your new password</Text>
                                </View>
                                <Button
                                    title="Back to login"
                                    onPress={() => navigation.navigate('Login')}
                                    style={styles.actionBtn}
                                />
                            </>
                        )}

                        {renderDivider()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 20, paddingBottom: 20 },
    logoSection: { alignItems: 'center', marginBottom: 30 },
    logo: { width: 180, height: 110 },
    haldiKumkum: { width: 90, height: 35, marginTop: -5 },
    formSection: { width: '100%', alignItems: 'center' },
    textCenter: { alignItems: 'center', marginBottom: 25 },
    title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 20 },
    actionBtn: { width: '100%', marginBottom: 20, borderRadius: 30, backgroundColor: Colors.primary },
    backLink: { paddingVertical: 10 },
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
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    dividerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 40, width: '70%' },
    goldenLine: { flex: 1, height: 1, backgroundColor: '#D4AF37' },
    ornamentGroup: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
    smallDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D4AF37', marginHorizontal: 2 },
    goldDiamond: { width: 8, height: 8, backgroundColor: '#D4AF37', transform: [{ rotate: '45deg' }], marginHorizontal: 4 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    footerText: { fontSize: 14, color: '#757575' },
    loginText: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
});

export default RegisterPage;
