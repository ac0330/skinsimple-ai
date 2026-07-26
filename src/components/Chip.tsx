import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}

const ChipView = styled.View<{ selected: boolean; fullWidth?: boolean }>`
  padding: ${({ fullWidth }) => (fullWidth ? '15px 18px' : '12px 18px')};
  border-radius: ${({ theme, fullWidth }) => (fullWidth ? theme.radius.lg : theme.radius.pill)}px;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.accent : theme.colors.surface)};
  border-width: 1.5px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.accent : theme.colors.border)};
  align-self: ${({ fullWidth }) => (fullWidth ? 'stretch' : 'flex-start')};
`;

const ChipLabel = styled.Text<{ selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.bodySemibold};
  font-size: 14.5px;
  color: ${({ theme, selected }) => (selected ? theme.colors.surface : theme.colors.textPrimary)};
`;

export function Chip({ label, selected, onPress, fullWidth }: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      <ChipView selected={selected} fullWidth={fullWidth}>
        <ChipLabel selected={selected}>{label}</ChipLabel>
      </ChipView>
    </Pressable>
  );
}
