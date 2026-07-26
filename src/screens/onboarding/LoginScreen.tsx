import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import styled from 'styled-components/native';

import { LinkBubble, PrimaryButton, TextLink } from '../../components/Button';
import { FadeHeroScreen, TextCloud } from '../../components/FadeHeroScreen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { AuthError, useAuth } from '../../context/AuthContext';
import { whiteWaterWavesImage } from '../../data/mockProducts';
import { isValidEmail, isValidPassword } from '../../services/authService';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Content = styled.View`
  flex: 1;
  gap: 16px;
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

const FieldGroup = styled.View`
  gap: 12px;
  margin-top: 6px;
`;

const HintText = styled.Text`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: -8px;
`;

const Spacer = styled.View`
  flex: 1;
`;

export function LoginScreen({ navigation }: Props) {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fieldsValid = isValidEmail(email) && isValidPassword(password);
  const hint = (email || password) && !fieldsValid
    ? !isValidEmail(email)
      ? 'Enter a valid email address'
      : 'Password must be at least 6 characters'
    : error;

  const handleLogin = async () => {
    try {
      setError('');
      await logIn({ email, password });
    } catch (e) {
      if (e instanceof AuthError) setError(e.message);
    }
  };

  return (
    <FadeHeroScreen source={whiteWaterWavesImage}>
      <ScreenHeader onBack={() => navigation.navigate('Welcome')} />
      <Content>
        <TextCloud>
          <Title>Welcome back</Title>
          <Subtitle>Log in to see your skin profile!</Subtitle>
        </TextCloud>
        <FieldGroup>
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </FieldGroup>
        {hint ? <HintText>{hint}</HintText> : null}
        <Spacer />
        <PrimaryButton label="Log In" disabled={!fieldsValid} onPress={handleLogin} />
        <LinkBubble>
          <TextLink
            prompt="New here?"
            actionLabel="Create an account"
            onPress={() => navigation.navigate('QuizType', {})}
          />
        </LinkBubble>
      </Content>
    </FadeHeroScreen>
  );
}
