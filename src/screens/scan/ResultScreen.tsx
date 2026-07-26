import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { PrimaryButton } from '../../components/Button';
import { MatchScoreRing } from '../../components/MatchScoreRing';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { MOCK_SCAN_RESULT } from '../../data/mockProducts';
import type { RootStackParamList, ScanStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ScanStackParamList, 'Result'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BrandText = styled.Text`
  font-size: 12.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  text-align: center;
`;

const ProductName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 2px;
  text-align: center;
`;

const RingSection = styled.View`
  align-items: center;
  gap: 10px;
  padding: 18px 0;
`;

const MatchLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 15.5px;
  color: ${({ theme }) => theme.colors.warning};
`;

const ReasonsList = styled.View`
  gap: 12px;
  padding-left: 14px;
`;

const ReasonRow = styled.View`
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
`;

const ReasonIcon = styled.View<{ positive: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme, positive }) => (positive ? theme.colors.success : theme.colors.warning)};
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

const ReasonIconText = styled.Text`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.surface};
`;

const ReasonText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 20px;
  flex: 1;
`;

const Spacer = styled.View`
  flex: 1;
`;

const HeaderRow = styled.View`
  padding-left: 14px;
`;

export function ResultScreen({ navigation, route }: Props) {
  const result = route.params?.result ?? MOCK_SCAN_RESULT;

  return (
    <Screen edges={['top']}>
      <HeaderRow>
        <ScreenHeader onBack={() => navigation.navigate('ScanMethod')} />
      </HeaderRow>
      <BrandText>{result.brand}</BrandText>
      <ProductName>{result.productName}</ProductName>
      <RingSection>
        <MatchScoreRing percent={result.matchPercent} />
        <MatchLabel>{result.matchLabel}</MatchLabel>
      </RingSection>
      <ReasonsList>
        {result.reasons.map((reason) => (
          <ReasonRow key={reason.id}>
            <ReasonIcon positive={reason.kind === 'positive'}>
              <ReasonIconText>{reason.kind === 'positive' ? '✓' : '✕'}</ReasonIconText>
            </ReasonIcon>
            <ReasonText>{reason.text}</ReasonText>
          </ReasonRow>
        ))}
      </ReasonsList>
      <Spacer />
      <PrimaryButton
        label="See Better Matches"
        onPress={() => navigation.navigate('Alternatives', { result })}
      />
    </Screen>
  );
}
