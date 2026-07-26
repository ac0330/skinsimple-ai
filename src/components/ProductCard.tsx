import React from 'react';
import styled from 'styled-components/native';

import type { AlternativeProduct } from '../types/domain';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 16px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
  gap: 8px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleBlock = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const BrandText = styled.Text`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`;

const NameText = styled.Text`
  font-size: 15.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MatchBadge = styled.View`
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.successBg};
  flex-shrink: 0;
`;

const MatchBadgeText = styled.Text`
  font-size: 11.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.success};
`;

const NoteText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PriceText = styled.Text`
  font-size: 14.5px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accent};
`;

interface ProductCardProps {
  product: AlternativeProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <TopRow>
        <TitleBlock>
          <BrandText>{product.brand}</BrandText>
          <NameText>{product.name}</NameText>
        </TitleBlock>
        <MatchBadge>
          <MatchBadgeText>{product.matchPercent} Match</MatchBadgeText>
        </MatchBadge>
      </TopRow>
      <NoteText>{product.note}</NoteText>
      <PriceText>{product.price}</PriceText>
    </Card>
  );
}
