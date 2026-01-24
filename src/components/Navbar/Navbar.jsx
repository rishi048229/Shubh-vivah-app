import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Navbar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Navbar Component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    text: {
        fontSize: 18,
    },
});

export default Navbar;
