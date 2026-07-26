import React from 'react';
import styled from 'styled-components/native';

const Row = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Segment = styled.View<{ active: boolean }>`
  height: 8px;
  flex: 1;
  border-radius: 4px;
  background-color: ${({ theme, active }) => (active ? theme.colors.accent : theme.colors.border)};
`;

interface QuizProgressBarProps {
  step: 1 | 2 | 3;
  totalSteps?: number;
}

export function QuizProgressBar({ step, totalSteps = 3 }: QuizProgressBarProps) {
  return (
    <Row>
      {Array.from({ length: totalSteps }, (_, i) => (
        <Segment key={i} active={i < step} />
      ))}
    </Row>
  );
}
