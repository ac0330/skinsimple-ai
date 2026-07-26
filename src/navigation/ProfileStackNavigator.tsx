import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HelpScreen } from '../screens/profile/HelpScreen';
import { PrivacyScreen } from '../screens/profile/PrivacyScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
}
