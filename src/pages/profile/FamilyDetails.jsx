import React, { useState } from 'react';
import { Alert } from 'react-native';
import ProfileLayout from './components/ProfileLayout';
import { CustomModalDropdown, Counter } from './components/FormControls';

const FATHER_OCCUPATIONS = [
    'Government Service',
    'Private Sector Job',
    'Self-Employed',
    'Business',
    'Professional (Teacher / Doctor / Nurse etc.)',
    'Retired',
    'Farmer',
    'Not Working',
    'Passed Away',
    'Other'
];

const MOTHER_OCCUPATIONS = [
    'Housewife',
    'Government Service',
    'Private Sector Job',
    'Self-Employed',
    'Business',
    'Professional (Teacher / Doctor / Nurse etc.)',
    'Retired',
    'Farmer',
    'Not Working',
    'Passed Away',
    'Other'
];
const FAMILY_TYPES = ['Joint Family', 'Nuclear Family'];
const FAMILY_STATUS = ['Upper Class', 'Middle Class', 'Lower Class'];
const FAMILY_VALUES = ['Traditional', 'Modern', 'Liberal'];

const FamilyDetails = ({ navigation }) => {
    const [formData, setFormData] = useState({
        fatherOccupation: '',
        motherOccupation: '',
        brothers: 0,
        sisters: 0,
        familyType: '',
        familyStatus: '',
        familyValues: '',
    });
    const [errors, setErrors] = useState({});

    const handleNext = () => {
        console.log('FamilyDetails: handleNext called');
        const { fatherOccupation, motherOccupation, familyType, familyStatus, familyValues } = formData;
        const newErrors = {};

        if (!fatherOccupation) newErrors.fatherOccupation = "Please select your father's occupation";
        if (!motherOccupation) newErrors.motherOccupation = "Please select your mother's occupation";
        if (!familyType) newErrors.familyType = 'Please select your family type';
        if (!familyStatus) newErrors.familyStatus = 'Please select your family status';
        if (!familyValues) newErrors.familyValues = 'Please select your family values';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = Object.values(newErrors)[0];
            Alert.alert('Validation Error', firstError);
            return;
        }

        setErrors({});
        console.log('FamilyDetails: Navigating to LifestyleHabits');
        navigation.navigate('LifestyleHabits');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const updateCounter = (key, delta) => {
        setFormData((prev) => {
            const newValue = Math.max(0, prev[key] + delta);
            return { ...prev, [key]: newValue };
        });
    };

    return (
        <ProfileLayout
            title="Add Family Details"
            stepTitle="Family Information"
            currentStep={4}
            totalSteps={5}
            onBack={handleBack}
            onContinue={handleNext}
        >
            <CustomModalDropdown
                label="Father's Occupation"
                value={formData.fatherOccupation}
                placeholder="Select Occupation"
                options={FATHER_OCCUPATIONS}
                onSelect={(val) => {
                    setFormData({ ...formData, fatherOccupation: val });
                    if (errors.fatherOccupation) setErrors({ ...errors, fatherOccupation: '' });
                }}
                error={errors.fatherOccupation}
            />

            <CustomModalDropdown
                label="Mother's Occupation"
                value={formData.motherOccupation}
                placeholder="Select Occupation"
                options={MOTHER_OCCUPATIONS}
                onSelect={(val) => {
                    setFormData({ ...formData, motherOccupation: val });
                    if (errors.motherOccupation) setErrors({ ...errors, motherOccupation: '' });
                }}
                error={errors.motherOccupation}
            />

            <Counter
                label="Brothers"
                value={formData.brothers}
                onIncrement={() => updateCounter('brothers', 1)}
                onDecrement={() => updateCounter('brothers', -1)}
            />

            <Counter
                label="Sisters"
                value={formData.sisters}
                onIncrement={() => updateCounter('sisters', 1)}
                onDecrement={() => updateCounter('sisters', -1)}
            />

            <CustomModalDropdown
                label="Family Type"
                value={formData.familyType}
                placeholder="Select Type"
                options={FAMILY_TYPES}
                onSelect={(val) => {
                    setFormData({ ...formData, familyType: val });
                    if (errors.familyType) setErrors({ ...errors, familyType: '' });
                }}
                error={errors.familyType}
            />

            <CustomModalDropdown
                label="Family Status"
                value={formData.familyStatus}
                placeholder="Select Status"
                options={FAMILY_STATUS}
                onSelect={(val) => {
                    setFormData({ ...formData, familyStatus: val });
                    if (errors.familyStatus) setErrors({ ...errors, familyStatus: '' });
                }}
                error={errors.familyStatus}
            />

            <CustomModalDropdown
                label="Family Values"
                value={formData.familyValues}
                placeholder="Select Values"
                options={FAMILY_VALUES}
                onSelect={(val) => {
                    setFormData({ ...formData, familyValues: val });
                    if (errors.familyValues) setErrors({ ...errors, familyValues: '' });
                }}
                error={errors.familyValues}
            />
        </ProfileLayout>
    );
};

// No local styles needed as ProfileLayout handles the theme

export default FamilyDetails;
