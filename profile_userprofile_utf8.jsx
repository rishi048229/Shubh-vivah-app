import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../utils/colors';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { Camera, User, Mail, Phone, Calendar, MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfile = () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('+91 9876543210');
    const [location, setLocation] = useState('Mumbai, Maharashtra');
    const [isEditing, setIsEditing] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile Details</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <User size={60} color={Colors.primary} />
                        </View>
                        <TouchableOpacity style={styles.editBadge}>
                            <Camera size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.userRole}>Premium Member</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        editable={isEditing}
                        icon={<User size={20} color={Colors.primary} />}
                    />

                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        editable={isEditing}
                        icon={<Mail size={20} color={Colors.primary} />}
                    />

                    <Input
                        label="Mobile Number"
                        value={phone}
                        onChangeText={setPhone}
                        editable={isEditing}
                        icon={<Phone size={20} color={Colors.primary} />}
                    />

                    <Input
                        label="Location"
                        value={location}
                        onChangeText={setLocation}
                        editable={isEditing}
                        icon={<MapPin size={20} color={Colors.primary} />}
                    />

                    <Button
                        title={isEditing ? "Save Changes" : "Edit Profile"}
                        onPress={() => setIsEditing(!isEditing)}
                        style={styles.actionBtn}
                    />
                </View>

                <View style={[styles.infoCard, styles.statsCard]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Profile Match</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Interests</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
    profileSection: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatarCircle: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.white,
        justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.primary,
        shadowColor: Colors.shadow, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    editBadge: {
        position: 'absolute', bottom: 5, right: 5, backgroundColor: Colors.primary,
        width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: Colors.white,
    },
    userName: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
    userRole: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 4 },
    infoCard: {
        backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 20, padding: 20,
        marginBottom: 20, shadowColor: Colors.shadow, shadowOpacity: 0.05, shadowRadius: 15, elevation: 2,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 20 },
    actionBtn: { marginTop: 10, borderRadius: 12 },
    statsCard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 25 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
    statLabel: { fontSize: 12, color: Colors.subtext, marginTop: 4 },
    divider: { width: 1, height: 40, backgroundColor: Colors.border },
});

export default UserProfile;
