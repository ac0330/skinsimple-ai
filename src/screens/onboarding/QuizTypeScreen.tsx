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
import { SKIN_TYPES } from '../../data/quizOptions';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizType'>;

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

const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const Spacer = styled.View`
  flex: 1;
`;

export function QuizTypeScreen({ navigation, route }: Props) {
  const { returnTo } = route.params;
  const { profile, setSkinType, setSensitive, isTypeStepValid } = useSkinProfile();

  const goToReturnTarget = () => {
    if (returnTo) navigation.navigate('MainTabs', { screen: returnTo });
    else navigation.navigate('Welcome');
  };

  return (
    <FadeHeroScreen source={whiteWaterWavesImage}>
      <Edge>
        <ScreenHeader onBack={goToReturnTarget} onExit={returnTo ? goToReturnTarget : undefined} />
      </Edge>
      <Content>
        <Edge>
          <QuizProgressBar step={1} />
        </Edge>
        <TextCloud>
          <Title>What's your skin type?</Title>
          <Subtitle>This helps us match you with the right ingredients.</Subtitle>
        </TextCloud>
        <ChipRow>
          {SKIN_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              selected={profile.skinType === type}
              onPress={() => setSkinType(type)}
            />
          ))}
        </ChipRow>
        <TextCloud>
          <SectionTitle>Do you have sensitive skin?</SectionTitle>
        </TextCloud>
        <ChipRow>
          <Chip label="Yes" selected={profile.sensitive === true} onPress={() => setSensitive(true)} />
          <Chip label="No" selected={profile.sensitive === false} onPress={() => setSensitive(false)} />
        </ChipRow>
        <Spacer />
        <PrimaryButton
          label="Continue"
          disabled={!isTypeStepValid}
          onPress={() => navigation.navigate('QuizConcerns', { returnTo })}
        />
      </Content>
    </FadeHeroScreen>
  );
}
