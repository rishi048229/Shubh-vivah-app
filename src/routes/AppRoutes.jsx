import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    TermsConditions,
    SelectGender,
    BasicDetails,
    ReligiousDetails,
    EducationCareerDetails,
    FamilyDetails,
    LifestyleHabits,
    ProfileCompleted
} from '../pages/profile';

const Stack = createStackNavigator();

const AppRoutes = () => {
    return (
        <Stack.Navigator
            initialRouteName="TermsConditions"
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="SelectGender" component={SelectGender} />
            <Stack.Screen name="BasicDetails" component={BasicDetails} />
            <Stack.Screen name="ReligiousDetails" component={ReligiousDetails} />
            <Stack.Screen name="EducationCareerDetails" component={EducationCareerDetails} />
            <Stack.Screen name="FamilyDetails" component={FamilyDetails} />
            <Stack.Screen name="LifestyleHabits" component={LifestyleHabits} />
            <Stack.Screen name="ProfileCompleted" component={ProfileCompleted} />
        </Stack.Navigator>
    );
};

export default AppRoutes;

