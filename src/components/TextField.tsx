import React from 'react';
import { TextInputProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const StyledInput = styled.TextInput`
  width: 100%;
  padding: 15px 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.inputBorder};
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export function TextField(props: TextInputProps) {
  const theme = useTheme();
  return <StyledInput placeholderTextColor={theme.colors.textDisabled} {...props} />;
}
