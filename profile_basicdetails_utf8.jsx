import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import ProfileLayout from './components/ProfileLayout';
import { CustomTextInput, CustomModalDropdown, RadioGroup, CustomDateInput, CustomPhoneInput } from './components/FormControls';

const HEIGHT_OPTIONS = [
    "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
    "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
    "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\""
];

const WEIGHT_OPTIONS = Array.from({ length: 61 }, (_, i) => `${40 + i} kg`);

const BasicDetails = ({ navigation, route }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: route?.params?.gender || '',
        dob: '',
        height: '',
        weight: '',
    });

    const [errors, setErrors] = useState({});

    const handleNext = () => {
        const { fullName, email, phone, gender, dob, height, weight } = formData;
        const newErrors = {};

        if (!fullName || !email || !phone || !gender || !dob || !height || !weight) {
            Alert.alert('Missing Details', 'Please fill all the details to continue.');
            return;
        }

        // Name validation: 2 to 5 words, 2-25 chars each, letters only
        const sanitizedName = fullName.trim().replace(/\s+/g, ' ');
        const hasInvalidChars = /[^A-Za-z ]/.test(sanitizedName);
        const nameParts = sanitizedName === '' ? [] : sanitizedName.split(' ');
        const isWordLengthInvalid = nameParts.some(part => part.length < 2 || part.length > 25);

        if (hasInvalidChars) {
            newErrors.fullName = 'Name can only contain letters and spaces';
        } else if (nameParts.length < 2) {
            newErrors.fullName = 'Please enter your full name (at least first and last name)';
        } else if (nameParts.length > 5) {
            newErrors.fullName = 'Full name cannot exceed 5 words';
        } else if (isWordLengthInvalid) {
            newErrors.fullName = 'Each part of your name should be 2ΓÇô25 letters long';
        }


        // Email validation: regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone number validation: must be exactly 10 digits
        if (phone.length !== 10) {
            newErrors.phone = 'Please enter a valid 10-digit mobile number';
        }

        // Gender, DOB, Height, Weight checks
        if (!gender) newErrors.gender = 'Please select your gender';
        if (!dob) newErrors.dob = 'Please select your date of birth';
        if (!height) newErrors.height = 'Please select your height';
        if (!weight) newErrors.weight = 'Please select your weight';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = Object.values(newErrors)[0];
            Alert.alert('Validation Error', firstError);
            return;
        }

        setErrors({});
        // Navigate to next screen
        navigation.navigate('ReligiousDetails');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <ProfileLayout
            title="Add Basic Details"
            stepTitle="Basic Information"
            currentStep={1}
            totalSteps={5}
            onBack={handleBack}
            onContinue={handleNext}
        >
            <CustomTextInput
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => {
                    setFormData({ ...formData, fullName: text });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="Enter your full name"
                error={errors.fullName}
            />

            <CustomTextInput
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={errors.email}
            />

            <CustomPhoneInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => {
                    setFormData({ ...formData, phone: text });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="Enter phone number"
                error={errors.phone}
            />

            <RadioGroup
                label="Gender"
                options={['Male', 'Female']}
                selectedOption={formData.gender}
                onSelect={(opt) => {
                    setFormData({ ...formData, gender: opt });
                    if (errors.gender) setErrors({ ...errors, gender: '' });
                }}
                error={errors.gender}
            />

            <CustomDateInput
                label="Date of Birth"
                value={formData.dob}
                onChange={(date) => {
                    setFormData({ ...formData, dob: date });
                    if (errors.dob) setErrors({ ...errors, dob: '' });
                }}
                error={errors.dob}
            />

            <CustomModalDropdown
                label="Height"
                value={formData.height}
                placeholder="Select Height"
                options={HEIGHT_OPTIONS}
                onSelect={(val) => {
                    setFormData({ ...formData, height: val });
                    if (errors.height) setErrors({ ...errors, height: '' });
                }}
                error={errors.height}
            />

            <CustomModalDropdown
                label="Weight"
                value={formData.weight}
                placeholder="Select Weight"
                options={WEIGHT_OPTIONS}
                onSelect={(val) => {
                    setFormData({ ...formData, weight: val });
                    if (errors.weight) setErrors({ ...errors, weight: '' });
                }}
                error={errors.weight}
            />
        </ProfileLayout>
    );
};

export default BasicDetails;
