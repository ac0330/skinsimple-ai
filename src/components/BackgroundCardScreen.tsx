import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const BackgroundWrap = styled.View`
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

const CardScroll = styled.ScrollView`
  flex: 1;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 32px;
  padding: 28px 28px 12px;
  shadow-color: #000;
  shadow-opacity: 0.18;
  shadow-radius: 24px;
  shadow-offset: 0px 12px;
  elevation: 6;
`;

interface BackgroundCardScreenProps {
  source: ImageSourcePropType;
  children: React.ReactNode;
}

export function BackgroundCardScreen({ source, children }: BackgroundCardScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <BackgroundWrap>
      <BackgroundImage source={source} resizeMode="cover" />
      <CardScroll
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 28,
          paddingTop: 28 + insets.top,
        }}
      >
        <Card>{children}</Card>
      </CardScroll>
    </BackgroundWrap>
  );
}
