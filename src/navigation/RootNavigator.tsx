import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { QuizBudgetScreen } from '../screens/onboarding/QuizBudgetScreen';
import { QuizConcernsScreen } from '../screens/onboarding/QuizConcernsScreen';
import { QuizTypeScreen } from '../screens/onboarding/QuizTypeScreen';
import { SignupScreen } from '../screens/onboarding/SignupScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator key={isAuthenticated ? 'authenticated' : 'guest'} screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="QuizType" component={QuizTypeScreen} initialParams={{}} />
          <Stack.Screen name="QuizConcerns" component={QuizConcernsScreen} initialParams={{}} />
          <Stack.Screen name="QuizBudget" component={QuizBudgetScreen} initialParams={{}} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="QuizType" component={QuizTypeScreen} initialParams={{}} />
          <Stack.Screen name="QuizConcerns" component={QuizConcernsScreen} initialParams={{}} />
          <Stack.Screen name="QuizBudget" component={QuizBudgetScreen} initialParams={{}} />
        </>
      )}
    </Stack.Navigator>
  );
}
