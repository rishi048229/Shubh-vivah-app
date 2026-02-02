import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Imports for removed modules deleted

import LandingPage from '../pages/auth/LandingPage';
import LanguageSelectionPage from '../pages/auth/LanguageSelectionPage';

const Stack = createStackNavigator();

const AppRoutes = () => {
    return (
        <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionPage} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    );
};

export default AppRoutes;
