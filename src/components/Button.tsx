import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'muted' | 'danger';
}

const Base = styled.View<{ disabled?: boolean; variant: 'solid' | 'muted' | 'danger' }>`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, disabled, variant }) => {
    if (disabled) return theme.colors.disabledBg;
    if (variant === 'muted') return theme.colors.blush;
    if (variant === 'danger') return theme.colors.accent;
    return theme.colors.accent;
  }};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-opacity: ${({ disabled, variant }) => (disabled || variant === 'muted' ? 0 : 0.35)};
  shadow-radius: 16px;
  shadow-offset: 0px 10px;
  elevation: ${({ disabled, variant }) => (disabled || variant === 'muted' ? 0 : 4)};
`;

const Label = styled.Text<{ disabled?: boolean; variant: 'solid' | 'muted' | 'danger' }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 16px;
  color: ${({ theme, disabled, variant }) => {
    if (disabled) return theme.colors.textDisabled;
    if (variant === 'muted') return theme.colors.accentText;
    return theme.colors.surface;
  }};
`;

export function PrimaryButton({ label, onPress, disabled, variant = 'solid' }: PrimaryButtonProps) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
      <Base disabled={disabled} variant={variant}>
        <Label disabled={disabled} variant={variant}>
          {label}
        </Label>
      </Base>
    </Pressable>
  );
}

export const LinkBubble = styled.View`
  align-self: center;
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 8px 18px;
`;

const LinkText = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.accentText};
  text-align: center;
`;

const LinkAction = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

interface TextLinkProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

export function TextLink({ prompt, actionLabel, onPress }: TextLinkProps) {
  return (
    <LinkText>
      {prompt}{' '}
      <LinkAction onPress={onPress} suppressHighlighting>
        {actionLabel}
      </LinkAction>
    </LinkText>
  );
}

const PlainLinkText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accentText};
  font-family: ${({ theme }) => theme.fonts.bodySemibold};
  text-decoration: underline;
  text-align: center;
`;

interface PlainLinkProps {
  label: string;
  onPress: () => void;
}

export function PlainLink({ label, onPress }: PlainLinkProps) {
  return (
    <PlainLinkText onPress={onPress} suppressHighlighting>
      {label}
    </PlainLinkText>
  );
}
