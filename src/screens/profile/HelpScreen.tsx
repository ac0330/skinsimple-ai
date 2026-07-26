import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { whiteMarbleImage } from '../../data/mockProducts';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Help'>;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 18px;
  text-align: center;
`;

const FaqList = styled.View`
  gap: 12px;
`;

const FaqCard = styled.View`
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px;
`;

const FaqQuestion = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const FaqAnswer = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accentText};
  margin-top: 4px;
  line-height: 18px;
  text-align: center;
`;

const FAQS = [
  {
    id: 'match',
    question: 'How does the match score work?',
    answer:
      'We compare a product’s ingredients against your skin type, concerns, and sensitivity.',
  },
  {
    id: 'privacy',
    question: 'Is my data kept private?',
    answer: 'Yes — see our Privacy settings for details.',
  },
];

export function HelpScreen({ navigation }: Props) {
  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={whiteMarbleImage}>
        <ScreenHeader onBack={() => navigation.navigate('ProfileHome')} />
        <Title>Help & Support</Title>
        <FaqList>
          {FAQS.map((faq) => (
            <FaqCard key={faq.id}>
              <FaqQuestion>{faq.question}</FaqQuestion>
              <FaqAnswer>{faq.answer}</FaqAnswer>
            </FaqCard>
          ))}
        </FaqList>
      </BackgroundCardScreen>
    </Screen>
  );
}
