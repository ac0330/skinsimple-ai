export type SkinType = 'Dry' | 'Normal' | 'Combination' | 'Oily';

export type Budget = 'Under $15' | '$15–30' | '$30–50' | '$50+' | "I'm open to anything";

export interface SkinProfile {
  skinType: SkinType | null;
  sensitive: boolean | null;
  concerns: string[];
  otherConcern: string;
  budget: Budget | null;
}

export interface Product {
  id: string;
  barcode: string;
  productName: string;
  brand: string;
}

export interface ScanReason {
  id: string;
  kind: 'positive' | 'negative';
  text: string;
}

export interface ScanResult {
  id: string;
  productName: string;
  brand: string;
  matchPercent: number;
  matchLabel: string;
  reasons: ScanReason[];
}

export interface AlternativeProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  matchPercent: string;
  note: string;
}
