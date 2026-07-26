import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const Wrap = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
  overflow: hidden;
`;

const HeroImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Fade = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;

interface FadeHeroImageProps {
  source: ImageSourcePropType;
  height?: number;
}

export function FadeHeroImage({ source, height = 340 }: FadeHeroImageProps) {
  const theme = useTheme();
  return (
    <Wrap height={height}>
      <HeroImage source={source} resizeMode="cover" />
      <Fade
        colors={['transparent', theme.colors.background]}
        locations={[0.4, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </Wrap>
  );
}
