import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { BackgroundCardScreen } from '../../components/BackgroundCardScreen';
import { PrimaryButton } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { cucumberImage } from '../../data/mockProducts';
import { scanService } from '../../services/scanService';
import type { Product } from '../../types/domain';
import type { ScanStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'Search'>;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
  margin-bottom: 16px;
`;

const SearchField = styled.View`
  gap: 12px;
`;

const HintText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 16px;
`;

const ResultList = styled.View`
  gap: 10px;
  margin-top: 16px;
`;

const ResultRow = styled.View`
  background-color: ${({ theme }) => theme.colors.blush};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 14px 16px;
`;

const ResultBrand = styled.Text`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accentText};
  text-transform: uppercase;
`;

const ResultName = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.bodySemibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 2px;
`;

export function SearchScreen({ navigation }: Props) {
  const { profile } = useSkinProfile();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || searching) return;
    setSearching(true);
    setErrorText(null);
    setCandidates([]);
    try {
      const results = await scanService.searchProducts(trimmed);
      setCandidates(results);
      setSearched(true);
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      setErrorText('Search failed — try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (product: Product) => {
    if (selecting) return;
    setSelecting(true);
    setErrorText(null);
    try {
      const result = await scanService.toScanResult(product, profile);
      navigation.navigate('Result', { result });
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      setErrorText('Analysis failed — try again.');
    } finally {
      setSelecting(false);
    }
  };

  return (
    <Screen padded={false} edges={[]} scroll={false}>
      <BackgroundCardScreen source={cucumberImage}>
        <ScreenHeader onBack={() => navigation.navigate('ScanMethod')} />
        <Title>Search by name</Title>
        <Subtitle>Type a product or brand name.</Subtitle>
        <SearchField>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. Vaseline Healing Jelly"
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <PrimaryButton
            label={searching ? 'Loading…' : 'Search'}
            disabled={!query.trim() || searching}
            onPress={handleSearch}
          />
        </SearchField>
        {errorText ? (
          <HintText>{errorText}</HintText>
        ) : selecting ? (
          <HintText>Analyzing…</HintText>
        ) : searched && candidates.length === 0 ? (
          <HintText>No products found for "{query.trim()}"</HintText>
        ) : candidates.length > 0 ? (
          <ResultList>
            {candidates.map((product) => (
              <Pressable key={product.id} onPress={() => handleSelect(product)}>
                <ResultRow>
                  <ResultBrand>{product.brand}</ResultBrand>
                  <ResultName>{product.productName}</ResultName>
                </ResultRow>
              </Pressable>
            ))}
          </ResultList>
        ) : null}
      </BackgroundCardScreen>
    </Screen>
  );
}
