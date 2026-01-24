import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import AppRoutes from './routes/AppRoutes';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
    let [fontsLoaded] = useFonts({
        Cinzel_400Regular,
        Cinzel_600SemiBold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <AppRoutes />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
