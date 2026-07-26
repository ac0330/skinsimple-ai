import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AlternativesScreen } from '../screens/scan/AlternativesScreen';
import { BarcodeScanScreen } from '../screens/scan/BarcodeScanScreen';
import { PhotoCaptureScreen } from '../screens/scan/PhotoCaptureScreen';
import { ResultScreen } from '../screens/scan/ResultScreen';
import { ScanMethodScreen } from '../screens/scan/ScanMethodScreen';
import { SearchScreen } from '../screens/scan/SearchScreen';
import type { ScanStackParamList } from './types';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export function ScanStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanMethod" component={ScanMethodScreen} />
      <Stack.Screen name="BarcodeScan" component={BarcodeScanScreen} />
      <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Alternatives" component={AlternativesScreen} />
    </Stack.Navigator>
  );
}
