import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { PrimaryButton } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { FadeHeroScreen, TextCloud } from '../../components/FadeHeroScreen';
import { QuizProgressBar } from '../../components/QuizProgressBar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { whiteWaterWavesImage } from '../../data/mockProducts';
import { CONCERNS } from '../../data/quizOptions';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizConcerns'>;

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

const Spacer = styled.View`
  flex: 1;
`;

export function QuizConcernsScreen({ navigation, route }: Props) {
  const { returnTo } = route.params;
  const { profile, toggleConcern, otherSelected, setOtherSelected, setOtherConcern, isConcernsStepValid } =
    useSkinProfile();

  const goToReturnTarget = () => {
    if (returnTo) navigation.navigate('MainTabs', { screen: returnTo });
  };

  return (
    <FadeHeroScreen source={whiteWaterWavesImage}>
      <Edge>
        <ScreenHeader
          onBack={() => navigation.navigate('QuizType', { returnTo })}
          onExit={returnTo ? goToReturnTarget : undefined}
        />
      </Edge>
      <Content>
        <Edge>
          <QuizProgressBar step={2} />
        </Edge>
        <TextCloud>
          <Title>What are you working on?</Title>
          <Subtitle>Pick as many as you like.</Subtitle>
        </TextCloud>
        <ChipRow>
          {CONCERNS.map((concern) => (
            <Chip
              key={concern}
              label={concern}
              selected={profile.concerns.includes(concern)}
              onPress={() => toggleConcern(concern)}
            />
          ))}
          <Chip label="+ Other" selected={otherSelected} onPress={() => setOtherSelected(!otherSelected)} />
        </ChipRow>
        {otherSelected ? (
          <TextField
            value={profile.otherConcern}
            onChangeText={setOtherConcern}
            placeholder="Tell us what's going on..."
          />
        ) : null}
        <Spacer />
        <PrimaryButton
          label="Continue"
          disabled={!isConcernsStepValid}
          onPress={() => navigation.navigate('QuizBudget', { returnTo })}
        />
      </Content>
    </FadeHeroScreen>
  );
}
