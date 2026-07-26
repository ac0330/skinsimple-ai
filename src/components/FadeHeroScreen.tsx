import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { Screen } from './Screen';

export const TextCloud = styled.View`
  align-self: center;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.88);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 14px 18px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

const Wrap = styled.View`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(251, 247, 241, 0.4);
`;

const Body = styled.ScrollView`
  flex: 1;
`;

interface FadeHeroScreenProps {
  source: ImageSourcePropType;
  children: React.ReactNode;
}

export function FadeHeroScreen({ source, children }: FadeHeroScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <Screen scroll={false} padded={false} edges={[]}>
      <Wrap>
        <BackgroundImage source={source} resizeMode="cover" />
        <Overlay pointerEvents="none" />
        <Body
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 60,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {children}
        </Body>
      </Wrap>
    </Screen>
  );
}
