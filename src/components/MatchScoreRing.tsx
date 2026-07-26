import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import styled, { useTheme } from 'styled-components/native';

const Center = styled.View`
  align-items: center;
  justify-content: center;
`;

const InnerCircle = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
`;

const PercentText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MatchLabelText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface MatchScoreRingProps {
  percent: number;
  size?: number;
}

export function MatchScoreRing({ percent, size = 132 }: MatchScoreRingProps) {
  const theme = useTheme();
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  const trackColor = percent >= 70 ? theme.colors.successBg : theme.colors.warningBg;
  const fillColor = percent >= 70 ? theme.colors.success : theme.colors.warning;

  return (
    <Center>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <InnerCircle size={size - strokeWidth * 2 - 6}>
            <PercentText>{percent}%</PercentText>
            <MatchLabelText>match</MatchLabelText>
          </InnerCircle>
        </View>
      </View>
    </Center>
  );
}
