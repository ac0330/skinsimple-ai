import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { PrimaryButton } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { profileBanner } from '../../data/mockProducts';
import type { MainTabParamList, ProfileStackParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>,
  CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'ProfileTab'>, NativeStackScreenProps<RootStackParamList>>
>;

const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.accent};
  align-items: center;
  justify-content: center;
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-opacity: 0.4;
  shadow-radius: 16px;
  shadow-offset: 0px 6px;
  elevation: 4;
`;

const AvatarInitial = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.surface};
`;

const NameText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmailText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProfileCard = styled.View`
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px 18px;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileCardTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accentText};
`;

const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CardRowLabel = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Chevron = styled.Text`
  color: ${({ theme }) => theme.colors.accentText};
  font-size: 16px;
`;

const MutedChevron = styled(Chevron)`
  color: ${({ theme }) => theme.colors.chevron};
`;

const RowList = styled.View`
  margin-top: 20px;
`;

const ListRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 4px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const RowLabel = styled.Text`
  font-size: 14.5px;
  font-family: ${({ theme }) => theme.fonts.bodyMedium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LogoutLabel = styled(RowLabel)`
  color: ${({ theme }) => theme.colors.error};
  font-family: ${({ theme }) => theme.fonts.bodySemibold};
`;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(58, 50, 46, 0.4);
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const ConfirmCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 26px 22px;
  width: 100%;
  gap: 16px;
`;

const ConfirmTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const ConfirmBody = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 20px;
`;

const ConfirmActions = styled.View`
  gap: 10px;
  margin-top: 4px;
`;

export function ProfileScreen({ navigation }: Props) {
  const { user, logOut } = useAuth();
  const { profile, skinTypeSummary, concernsSummary } = useSkinProfile();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const displayName = (user?.name && user.name.trim()) || 'there';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={profileBanner}>
        <AvatarRow>
          <Avatar>
            <AvatarInitial>{avatarInitial}</AvatarInitial>
          </Avatar>
          <NameText>{displayName}</NameText>
        </AvatarRow>
        <EmailText style={{ marginLeft: 70, marginTop: -14 }}>
          {user?.email || 'your@email.com'}
        </EmailText>

        <ProfileCard>
          <ProfileCardTitle>Skin Profile</ProfileCardTitle>
          <Pressable onPress={() => navigation.navigate('QuizType', { returnTo: 'ProfileTab' })}>
            <CardRow>
              <CardRowLabel>Skin type · {skinTypeSummary}</CardRowLabel>
              <Chevron>›</Chevron>
            </CardRow>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('QuizConcerns', { returnTo: 'ProfileTab' })}>
            <CardRow>
              <CardRowLabel>Concerns · {concernsSummary}</CardRowLabel>
              <Chevron>›</Chevron>
            </CardRow>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('QuizBudget', { returnTo: 'ProfileTab' })}>
            <CardRow>
              <CardRowLabel>Budget · {profile.budget || 'Not set'}</CardRowLabel>
              <Chevron>›</Chevron>
            </CardRow>
          </Pressable>
        </ProfileCard>

        <RowList>
          <Pressable onPress={() => navigation.navigate('Privacy')}>
            <ListRow>
              <RowLabel>Privacy</RowLabel>
              <MutedChevron>›</MutedChevron>
            </ListRow>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Help')}>
            <ListRow>
              <RowLabel>Help & Support</RowLabel>
              <MutedChevron>›</MutedChevron>
            </ListRow>
          </Pressable>
          <Pressable onPress={() => setConfirmLogout(true)}>
            <ListRow style={{ borderBottomWidth: 0 }}>
              <LogoutLabel>Log out</LogoutLabel>
              <MutedChevron>›</MutedChevron>
            </ListRow>
          </Pressable>
        </RowList>
      </BackgroundCardScreen>

      <Modal visible={confirmLogout} transparent animationType="fade">
        <ModalBackdrop>
          <ConfirmCard>
            <ConfirmTitle>Log out?</ConfirmTitle>
            <ConfirmBody>
              You'll need to log back in to see your skin profile and scan history.
            </ConfirmBody>
            <ConfirmActions>
              <PrimaryButton
                label="Log Out"
                onPress={() => {
                  setConfirmLogout(false);
                  logOut();
                }}
              />
              <PrimaryButton label="Cancel" variant="muted" onPress={() => setConfirmLogout(false)} />
            </ConfirmActions>
          </ConfirmCard>
        </ModalBackdrop>
      </Modal>
    </Screen>
  );
}
