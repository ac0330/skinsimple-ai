import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { HomeScreen } from '../screens/home/HomeScreen';
import { theme } from '../theme/theme';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { ScanStackNavigator } from './ScanStackNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ScanIcon = styled.View<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 3px;
  border-color: ${({ color }) => color};
`;

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.chevron,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          height: 58 + Math.max(insets.bottom, 12),
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bodySemibold,
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStackNavigator}
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
