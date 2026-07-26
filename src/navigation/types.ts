import type { NavigatorScreenParams } from '@react-navigation/native';

import type { ScanResult } from '../types/domain';

export type EditReturnTarget = 'HomeTab' | 'ProfileTab';

export type QuizParams = {
  returnTo?: EditReturnTarget;
};

export type ScanStackParamList = {
  ScanMethod: undefined;
  BarcodeScan: { returnTo?: EditReturnTarget } | undefined;
  PhotoCapture: undefined;
  Search: undefined;
  Result: { result?: ScanResult } | undefined;
  Alternatives: { result?: ScanResult } | undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Privacy: undefined;
  Help: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ScanTab: NavigatorScreenParams<ScanStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  QuizType: QuizParams;
  QuizConcerns: QuizParams;
  QuizBudget: QuizParams;
  Signup: undefined;
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
