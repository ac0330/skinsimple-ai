import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { PlainLink, PrimaryButton } from '../../components/Button';
import { FadeHeroImage } from '../../components/FadeHeroImage';
import { Screen } from '../../components/Screen';
import { heroImage } from '../../data/mockProducts';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const Body = styled.View`
  flex: 1;
  align-items: center;
  padding: 4px 60px 4px;
  gap: 14px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Tagline = styled.Text`
  font-family: ${({ theme }) => theme.fonts.headingSemibold};
  font-size: 19px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  line-height: 26px;
`;

const Description = styled.Text`
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 21px;
  max-width: 280px;
`;

const Spacer = styled.View`
  flex: 1;
`;

const Actions = styled.View`
  width: 100%;
  gap: 14px;
  padding-bottom: 8px;
`;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} padded={false} edges={['bottom']}>
      <FadeHeroImage source={heroImage} />
      <Body>
        <Title>SkinSimple AI</Title>
        <Tagline>Skincare that actually gets your skin.</Tagline>
        <Description>
          Tell us your skin type and budget, scan any product, and we'll tell you if it's actually
          worth it.
        </Description>
        <Spacer />
        <Actions>
          <PrimaryButton label="Get Started" onPress={() => navigation.navigate('QuizType', {})} />
          <PlainLink label="I already have an account" onPress={() => navigation.navigate('Login')} />
        </Actions>
      </Body>
    </Screen>
  );
}
