import React from 'react';
import styled from 'styled-components/native';

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  margin-bottom: 8px;
`;

const BackChevron = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
  width: 30px;
`;

const ExitLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
`;

interface ScreenHeaderProps {
  onBack?: () => void;
  onExit?: () => void;
}

export function ScreenHeader({ onBack, onExit }: ScreenHeaderProps) {
  return (
    <Row>
      <BackChevron onPress={onBack} suppressHighlighting>
        {onBack ? '‹' : ''}
      </BackChevron>
      {onExit ? (
        <ExitLabel onPress={onExit} suppressHighlighting>
          Exit
        </ExitLabel>
      ) : null}
    </Row>
  );
}
