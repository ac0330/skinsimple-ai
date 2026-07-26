import { MOCK_PRODUCT_CATALOG } from '../data/mockProducts';
import { geminiService, type GeminiCompatibility } from './geminiService';
import type { AlternativeProduct, Product, ScanReason, ScanResult, SkinProfile } from '../types/domain';

export interface ScanService {
  scanProduct(photoBase64: string, profile: SkinProfile, mimeType?: string): Promise<ScanResult>;
  lookupByBarcode(barcode: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
  toScanResult(product: Product, profile: SkinProfile): Promise<ScanResult>;
  getAlternatives(result: ScanResult, profile: SkinProfile): Promise<AlternativeProduct[]>;
}

function labelForPercent(percent: number): string {
  if (percent >= 80) return 'Great Match';
  if (percent >= 50) return 'Okay Match';
  return 'Not a Great Match';
}

function toReasons(reasons: GeminiCompatibility['reasons']): ScanReason[] {
  return reasons.map((reason, index) => ({ id: `r${index}`, ...reason }));
}

// Barcode lookup stays backed by the local mock catalog — there's no real barcode database here.
// Name search and photo capture identify the product via geminiService instead, since Gemini can
// recognize real products from a description or photo without needing our own product database.
export class MockScanService implements ScanService {
  private alternativesCache = new Map<string, AlternativeProduct[]>();

  async scanProduct(
    photoBase64: string,
    profile: SkinProfile,
    mimeType?: string
  ): Promise<ScanResult> {
    const analysis = await geminiService.analyzeImage(photoBase64, profile, mimeType);
    return {
      id: `scan-${Date.now()}`,
      productName: analysis.productName,
      brand: analysis.brand,
      matchPercent: analysis.matchPercent,
      matchLabel: labelForPercent(analysis.matchPercent),
      reasons: toReasons(analysis.reasons),
    };
  }

  async lookupByBarcode(barcode: string): Promise<Product | null> {
    return MOCK_PRODUCT_CATALOG.find((product) => product.barcode === barcode) ?? null;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const candidates = await geminiService.searchProducts(query);
    return candidates.map((candidate, index) => ({
      id: `search-${index}`,
      barcode: '',
      productName: candidate.productName,
      brand: candidate.brand,
    }));
  }

  async toScanResult(product: Product, profile: SkinProfile): Promise<ScanResult> {
    const analysis = await geminiService.analyzeProduct(product, profile);
    return {
      id: `scan-${product.id}`,
      productName: product.productName,
      brand: product.brand,
      matchPercent: analysis.matchPercent,
      matchLabel: labelForPercent(analysis.matchPercent),
      reasons: toReasons(analysis.reasons),
    };
  }

  async getAlternatives(result: ScanResult, profile: SkinProfile): Promise<AlternativeProduct[]> {
    const cached = this.alternativesCache.get(result.id);
    if (cached) return cached;

    const alternatives = await geminiService.suggestAlternatives(result, profile);
    const withIds = alternatives.map((alternative, index) => ({ id: `alt-${index}`, ...alternative }));
    this.alternativesCache.set(result.id, withIds);
    return withIds;
  }
}

export const scanService: ScanService = new MockScanService();
