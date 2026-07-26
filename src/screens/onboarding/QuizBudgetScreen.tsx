import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { PrimaryButton } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { FadeHeroScreen, TextCloud } from '../../components/FadeHeroScreen';
import { QuizProgressBar } from '../../components/QuizProgressBar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { whiteWaterWavesImage } from '../../data/mockProducts';
import { BUDGETS } from '../../data/quizOptions';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizBudget'>;

const Content = styled.View`
  flex: 1;
  gap: 18px;
`;

const Edge = styled.View`
  margin-horizontal: -24px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 23px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.accentText};
  text-align: center;
`;

const ChipColumn = styled.View`
  gap: 10px;
  margin-top: 4px;
  align-items: center;
`;

const Spacer = styled.View`
  flex: 1;
`;

export function QuizBudgetScreen({ navigation, route }: Props) {
  const { returnTo } = route.params;
  const { profile, setBudget, isBudgetStepValid } = useSkinProfile();

  const goToReturnTarget = () => {
    if (returnTo) navigation.navigate('MainTabs', { screen: returnTo });
  };

  const handleContinue = () => {
    if (returnTo) goToReturnTarget();
    else navigation.navigate('Signup');
  };

  return (
    <FadeHeroScreen source={whiteWaterWavesImage}>
      <Edge>
        <ScreenHeader
          onBack={() => navigation.navigate('QuizConcerns', { returnTo })}
          onExit={returnTo ? goToReturnTarget : undefined}
        />
      </Edge>
      <Content>
        <Edge>
          <QuizProgressBar step={3} />
        </Edge>
        <TextCloud>
          <Title>What's your budget?</Title>
          <Subtitle>Per product — we'll stay in your range.</Subtitle>
        </TextCloud>
        <ChipColumn>
          {BUDGETS.map((budget) => (
            <Chip
              key={budget}
              label={budget}
              selected={profile.budget === budget}
              onPress={() => setBudget(budget)}
              fullWidth
            />
          ))}
        </ChipColumn>
        <Spacer />
        <PrimaryButton label="Continue" disabled={!isBudgetStepValid} onPress={handleContinue} />
      </Content>
    </FadeHeroScreen>
  );
}
