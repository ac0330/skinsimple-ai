import type { Product, ScanResult } from '../types/domain';

export const heroImage = require('../../assets/images/hero-flower.jpg');
export const profileBanner = require('../../assets/images/profile-banner.jpg');
export const skincareImage = require('../../assets/images/skincares.jpg');
export const skincare2Image = require('../../assets/images/skincare2.jpg');
export const cucumberImage = require('../../assets/images/cucumber.jpg');
export const whiteMarbleImage = require('../../assets/images/whitemarble.jpg');
export const whiteWaterWavesImage = require('../../assets/images/whitewaterwaves.jpg');
export const fruitAesthetic = require('../../assets/images/fruitaesthetic.jpg');

export const MOCK_PRODUCT_CATALOG: Product[] = [
  { id: 'prod-1', barcode: '012345678905', productName: 'GlowMax Vitamin C Serum', brand: 'Brightening Co.' },
  { id: 'prod-2', barcode: '012345678912', productName: 'Pure Radiance Vitamin C 10%', brand: 'CalmSkin' },
  { id: 'prod-3', barcode: '012345678929', productName: 'Sensitive Bright Serum', brand: 'DewyLab' },
  { id: 'prod-4', barcode: '012345678936', productName: 'Daily Glow Drops', brand: 'MinimalSkin' },
  { id: 'prod-5', barcode: '012345678943', productName: 'Gentle Foaming Cleanser', brand: 'CalmSkin' },
  { id: 'prod-6', barcode: '012345678950', productName: 'Hydrating Barrier Cream', brand: 'DewyLab' },
  { id: 'prod-7', barcode: '012345678967', productName: 'Niacinamide 10% Serum', brand: 'MinimalSkin' },
  { id: 'prod-8', barcode: '012345678974', productName: 'Overnight Retinol Repair', brand: 'Brightening Co.' },
  { id: 'prod-9', barcode: '012345678981', productName: 'SPF 50 Daily Shield', brand: 'CalmSkin' },
  { id: 'prod-10', barcode: '012345678998', productName: 'Rose Water Toner', brand: 'DewyLab' },
];

export const MOCK_SCAN_RESULT: ScanResult = {
  id: 'scan-glowmax',
  productName: 'GlowMax Vitamin C Serum',
  brand: 'Brightening Co.',
  matchPercent: 42,
  matchLabel: 'Not a Great Match',
  reasons: [
    { id: 'r1', kind: 'negative', text: 'Contains fragrance — may irritate sensitive skin' },
    { id: 'r2', kind: 'negative', text: 'High Vitamin C strength — can be too much for beginners' },
    { id: 'r3', kind: 'positive', text: 'Lightweight, non-comedogenic base' },
  ],
};
