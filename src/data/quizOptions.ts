import type { Budget, SkinType } from '../types/domain';

export const SKIN_TYPES: SkinType[] = ['Dry', 'Normal', 'Combination', 'Oily'];

export const CONCERNS: string[] = [
  'Acne & breakouts',
  'Blackheads',
  'Dark spots',
  'Redness',
  'Dryness',
  'Oiliness',
  'Dullness',
  'Enlarged pores',
  'Fine lines',
  'Uneven texture',
];

export const BUDGETS: Budget[] = ['Under $15', '$15–30', '$30–50', '$50+', "I'm open to anything"];
