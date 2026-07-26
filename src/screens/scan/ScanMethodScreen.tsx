import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { PrimaryButton } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { skincareImage } from '../../data/mockProducts';
import type { ScanStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanMethod'>;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
`;

const Subtitle = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
`;

const OptionList = styled.View`
  gap: 22px;
`;

export function ScanMethodScreen({ navigation }: Props) {
  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={skincareImage}>
        <Title>Check a product</Title>
        <Subtitle>Choose how you'd like to find it.</Subtitle>
        <OptionList>
          <PrimaryButton
            label="Scan Barcode"
            variant="muted"
            onPress={() => navigation.navigate('BarcodeScan')}
          />
          <PrimaryButton
            label="Search by Name"
            variant="muted"
            onPress={() => navigation.navigate('Search')}
          />
          <PrimaryButton
            label="Take a Photo"
            variant="muted"
            onPress={() => navigation.navigate('PhotoCapture')}
          />
        </OptionList>
      </BackgroundCardScreen>
    </Screen>
  );
}
