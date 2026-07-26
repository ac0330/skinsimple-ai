import React from 'react';
import { ScrollViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
})``;

interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top', 'bottom'],
  ...rest
}: ScreenProps) {
  const paddingStyle = padded ? { paddingHorizontal: 60, paddingTop: 24, paddingBottom: 40 } : undefined;

  if (!scroll) {
    return (
      <Container edges={edges} style={paddingStyle}>
        {children}
      </Container>
    );
  }

  return (
    <Container edges={edges}>
      <Content
        {...rest}
        contentContainerStyle={[{ flexGrow: 1 }, paddingStyle, rest.contentContainerStyle]}
      >
        {children}
      </Content>
    </Container>
  );
}
