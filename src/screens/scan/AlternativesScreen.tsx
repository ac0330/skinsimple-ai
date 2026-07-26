import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { ProductCard } from '../../components/ProductCard';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { MOCK_SCAN_RESULT, skincare2Image } from '../../data/mockProducts';
import { scanService } from '../../services/scanService';
import type { AlternativeProduct } from '../../types/domain';
import type { ScanStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'Alternatives'>;

const HeaderRow = styled.View`
  padding-left: 14px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.accentText};
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
  margin-bottom: 16px;
  text-align: center;
`;

const CardList = styled.View`
  gap: 12px;
`;

const LoadingBlock = styled.View`
  align-items: center;
  gap: 12px;
  padding: 24px 0;
`;

const LoadingText = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
`;

const DisclaimerText = styled.Text`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 12px;
`;

export function AlternativesScreen({ navigation, route }: Props) {
  const result = route.params?.result ?? MOCK_SCAN_RESULT;
  const { profile, concernsSummary } = useSkinProfile();
  const theme = useTheme();
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadFailed(false);
    scanService
      .getAlternatives(result, profile)
      .then(setAlternatives)
      .catch((error) => {
        console.error('Gemini analysis failed:', error);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [result, profile]);

  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={skincare2Image}>
        <HeaderRow>
          <ScreenHeader onBack={() => navigation.navigate('Result', { result })} />
        </HeaderRow>
        <Title>Better matches for you</Title>
        <Subtitle>
          Picked for {concernsSummary || 'your skin'}
          {profile.budget ? `, ${profile.budget}` : ''}
        </Subtitle>
        {loading ? (
          <LoadingBlock>
            <ActivityIndicator color={theme.colors.accent} />
            <LoadingText>Finding your best matches…</LoadingText>
          </LoadingBlock>
        ) : loadFailed ? (
          <ErrorText>Couldn't load alternatives — try going back and reopening this page.</ErrorText>
        ) : (
          <>
            <CardList>
              {alternatives.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CardList>
            <DisclaimerText>Prices are AI estimates and may not reflect current pricing.</DisclaimerText>
          </>
        )}
      </BackgroundCardScreen>
    </Screen>
  );
}
