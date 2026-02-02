import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Platform, TouchableWithoutFeedback } from 'react-native';
import { ChevronDown, Circle, CheckCircle2, Check, Minus, Plus, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants';

export const CustomTextInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', error }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                (isFocused || value) && { borderColor: COLORS.PRIMARY },
                error && { borderColor: '#FF0000' }
            ]}>
                <TextInput
                    style={[styles.input, value && { color: COLORS.PRIMARY }, error && { color: '#FF0000' }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.PLACEHOLDER}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export const CustomDropdown = ({ label, value, placeholder, onPress }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.inputWrapper, value && { borderColor: COLORS.PRIMARY }]}
        >
            <Text style={[styles.input, value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER }]}>
                {value || placeholder}
            </Text>
            <ChevronDown size={20} color={value ? COLORS.PRIMARY : COLORS.PLACEHOLDER} />
        </TouchableOpacity>
    </View>
);

export const CustomModalDropdown = ({ label, value, placeholder, options, onSelect, error }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setVisible(true)}
                style={[
                    styles.inputWrapper,
                    value && { borderColor: COLORS.PRIMARY },
                    error && { borderColor: '#FF0000' }
                ]}
            >
                <Text style={[
                    styles.input,
                    value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER },
                    error && { color: '#FF0000' }
                ]}>
                    {value || placeholder}
                </Text>
                <ChevronDown size={20} color={error ? '#FF0000' : (value ? COLORS.PRIMARY : COLORS.PLACEHOLDER)} />
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} activeOpacity={1}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select {label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalItemText, item === value && styles.modalItemTextSelected]}>
                                        {item}
                                    </Text>
                                    {item === value && <Check size={20} color={COLORS.PRIMARY} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export const CustomDateInput = ({ label, value, onChange, error }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            // Format DD/MM/YYYY
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formatted = `${day}/${month}/${year}`;
            onChange(formatted);
        }
    };

    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowPicker(true)}
                style={[
                    styles.inputWrapper,
                    value && { borderColor: COLORS.PRIMARY },
                    error && { borderColor: '#FF0000' }
                ]}
            >
                <Text style={[
                    styles.input,
                    value ? { color: COLORS.PRIMARY } : { color: COLORS.PLACEHOLDER },
                    error && { color: '#FF0000' }
                ]}>
                    {value || 'DD/MM/YYYY'}
                </Text>
                <ChevronDown size={20} color={error ? '#FF0000' : (value ? COLORS.PRIMARY : COLORS.PLACEHOLDER)} />
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

            {showPicker && (
                <DateTimePicker
                    value={new Date()} // Default to today or parse existing value?
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()} // Can't be born in future
                />
            )}
        </View>
    );
};

export const RadioGroup = ({ label, options = [], selectedOption, onSelect, horizontal = true, error }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.radioGroup, horizontal ? styles.row : styles.column]}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    activeOpacity={0.8}
                    style={styles.radioButton}
                    onPress={() => onSelect(option)}
                >
                    {selectedOption === option ? (
                        <View style={styles.radioSelected}>
                            <View style={styles.radioInner} />
                        </View>
                    ) : (
                        <View style={[styles.radioUnselected, error && { borderColor: '#FF0000' }]} />
                    )}
                    <Text style={[
                        styles.radioText,
                        selectedOption === option && { color: COLORS.PRIMARY, fontWeight: '600' },
                        error && !selectedOption && { color: '#FF0000' }
                    ]}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

export const CustomPhoneInput = ({ label, value, onChangeText, placeholder, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChangeText = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        onChangeText(cleaned.slice(0, 10));
    };

    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                (isFocused || (value && value.length === 10)) && { borderColor: COLORS.PRIMARY },
                error && { borderColor: '#FF0000' }
            ]}>
                <View style={styles.phonePrefixContainer}>
                    <Text style={[
                        styles.phonePrefixText,
                        (isFocused || value) && { color: COLORS.PRIMARY },
                        error && { color: '#FF0000' }
                    ]}>+91</Text>
                    <View style={[
                        styles.phoneDivider,
                        (isFocused || value) && { backgroundColor: COLORS.PRIMARY },
                        error && { backgroundColor: '#FF0000' }
                    ]} />
                </View>
                <TextInput
                    style={[styles.input, value && { color: COLORS.PRIMARY }, error && { color: '#FF0000' }]}
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.PLACEHOLDER}
                    keyboardType="phone-pad"
                    maxLength={10}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export const Counter = ({ label, value, onIncrement, onDecrement }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.counterWrapper, value > 0 && { borderColor: COLORS.PRIMARY }]}>
            <TouchableOpacity onPress={onDecrement} style={styles.counterBtn}>
                <Minus size={20} color={COLORS.TEXT} />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{value}</Text>
            <TouchableOpacity onPress={onIncrement} style={styles.counterBtn}>
                <Plus size={20} color={COLORS.TEXT} />
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        fontWeight: '500',
        fontFamily: 'Outfit_500Medium',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.INPUT_BG,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: 8, // Reverted: Back to rectangular look
        paddingHorizontal: 12,
        height: 44, // Decreased height from 50 to 44
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.TEXT,
        fontFamily: 'Outfit_400Regular',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 12,
        maxHeight: '60%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.TEXT,
        fontFamily: 'Outfit_700Bold',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: COLORS.TEXT,
        fontFamily: 'Outfit_400Regular',
    },
    modalItemTextSelected: {
        color: COLORS.PRIMARY,
        fontWeight: 'bold',
    },
    radioGroup: {
        flexWrap: 'wrap',
        gap: 15,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    radioUnselected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        marginRight: 8,
    },
    radioSelected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.PRIMARY,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.PRIMARY,
    },
    radioText: {
        fontSize: 14,
        color: COLORS.TEXT,
    },
    counterWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.INPUT_BG,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: 8, // Reverted: Back to rectangular look
        height: 44, // Decreased height from 50 to 44
        width: 150, // Fixed width for neatness
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    counterBtn: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.TEXT,
        fontFamily: 'Outfit_600SemiBold',
    },
    phonePrefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    phonePrefixText: {
        fontSize: 14,
        color: COLORS.PLACEHOLDER,
        fontFamily: 'Outfit_500Medium',
    },
    phoneDivider: {
        width: 1,
        height: 18,
        backgroundColor: COLORS.BORDER,
        marginLeft: 8,
    },
    errorText: {
        fontSize: 11,
        color: '#FF0000',
        marginTop: 4,
        marginLeft: 2,
        fontFamily: 'Outfit_400Regular',
    },
});
