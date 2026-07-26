import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { whiteMarbleImage } from '../../data/mockProducts';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Privacy'>;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 18px;
  text-align: center;
`;

const DescriptionCard = styled.View`
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px;
`;

const Description = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.accentText};
  line-height: 20px;
  text-align: center;
`;

export function PrivacyScreen({ navigation }: Props) {
  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={whiteMarbleImage}>
        <ScreenHeader onBack={() => navigation.navigate('ProfileHome')} />
        <Title>Privacy</Title>
        <DescriptionCard>
          <Description>
            We only use your skin profile to power your product matches — never sold to third
            parties.
          </Description>
        </DescriptionCard>
      </BackgroundCardScreen>
    </Screen>
  );
}
