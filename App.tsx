import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import { AppProviders } from './src/context/AppProviders';
import { useAuth } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/theme/theme';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const prevAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (prevAuthenticated.current !== isAuthenticated) {
      prevAuthenticated.current = isAuthenticated;
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: isAuthenticated ? 'MainTabs' : 'Welcome' }],
      });
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
