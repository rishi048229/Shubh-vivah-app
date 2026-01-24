import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import HomePage from '../pages/home/HomePage';
import UserProfile from '../pages/profile/UserProfile';
import EditProfile from '../pages/profile/EditProfile';
import MatchList from '../pages/matchmaking/MatchList';
import MatchFilters from '../pages/matchmaking/MatchFilters';
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
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="MatchList" component={MatchList} />
            <Stack.Screen name="MatchFilters" component={MatchFilters} />
        </Stack.Navigator>
    );
};

export default AppRoutes;

