import { LinearGradient } from 'expo-linear-gradient';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { fruitAesthetic, heroImage } from '../../data/mockProducts';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Greeting = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const GreetingSub = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
  text-align: center;
`;

const ProfileCard = styled.View`
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 18px 20px;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProfileCardTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.accentText};
`;

const EditLabel = styled.Text`
  font-size: 12.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accentText};
  text-decoration: underline;
`;

const TagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const Tag = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 6px 12px;
`;

const TagText = styled.Text`
  font-size: 12.5px;
  font-family: ${({ theme }) => theme.fonts.bodySemibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ScanCta = styled.View`
  border-radius: ${({ theme }) => theme.radius.xl}px;
  overflow: hidden;
  min-height: 96px;
  margin-top: 20px;
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-opacity: 0.35;
  shadow-radius: 20px;
  shadow-offset: 0px 12px;
  elevation: 5;
`;

const ScanCtaImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ScanCtaOverlay = styled(LinearGradient)`
  padding: 26px 22px;
  align-items: center;
  justify-content: center;
  min-height: 96px;
`;

const ScanCtaTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

const ScanCtaSubtitle = styled.Text`
  font-size: 13px;
  color: #fceff0;
  margin-top: 4px;
  text-align: center;
`;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { profile, skinTypeSummary, concernsSummary } = useSkinProfile();

  const displayName = (user?.name && user.name.trim()) || 'there';
  const budget = profile.budget || 'Not set';

  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={fruitAesthetic}>
        <Greeting>Hey {displayName} 🌸</Greeting>
        <GreetingSub>Ready to check a product?</GreetingSub>

        <ProfileCard>
          <ProfileCardHeader>
            <ProfileCardTitle>Your Skin Profile</ProfileCardTitle>
            <Pressable onPress={() => navigation.navigate('QuizType', { returnTo: 'HomeTab' })}>
              <EditLabel>Edit</EditLabel>
            </Pressable>
          </ProfileCardHeader>
          <TagRow>
            <Tag>
              <TagText>{skinTypeSummary}</TagText>
            </Tag>
            <Tag>
              <TagText>{concernsSummary}</TagText>
            </Tag>
            <Tag>
              <TagText>{budget}</TagText>
            </Tag>
          </TagRow>
        </ProfileCard>

        <Pressable
          onPress={() =>
            navigation.navigate('ScanTab', {
              screen: 'BarcodeScan',
              params: { returnTo: 'HomeTab' },
            })
          }
        >
          <ScanCta>
            <ScanCtaImage source={heroImage} resizeMode="cover" />
            <ScanCtaOverlay colors={['rgba(221,143,166,0.5)', 'rgba(138,74,99,0.78)']}>
              <ScanCtaTitle>Scan a Product</ScanCtaTitle>
              <ScanCtaSubtitle>Use barcode to check if it matches your skin</ScanCtaSubtitle>
            </ScanCtaOverlay>
          </ScanCta>
        </Pressable>
      </BackgroundCardScreen>
    </Screen>
  );
}
