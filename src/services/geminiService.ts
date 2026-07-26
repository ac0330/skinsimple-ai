import type { AlternativeProduct, Product, ScanReason, ScanResult, SkinProfile } from '../types/domain';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiCompatibility {
  matchPercent: number;
  reasons: Omit<ScanReason, 'id'>[];
}

export interface GeminiImageAnalysis extends GeminiCompatibility {
  productName: string;
  brand: string;
}

export interface GeminiProductCandidate {
  productName: string;
  brand: string;
}

export interface GeminiService {
  analyzeProduct(product: Product, profile: SkinProfile): Promise<GeminiCompatibility>;
  searchProducts(query: string): Promise<GeminiProductCandidate[]>;
  analyzeImage(
    base64Image: string,
    profile: SkinProfile,
    mimeType?: string
  ): Promise<GeminiImageAnalysis>;
  suggestAlternatives(
    result: ScanResult,
    profile: SkinProfile
  ): Promise<Omit<AlternativeProduct, 'id'>[]>;
}

function describeProfile(profile: SkinProfile): string {
  const parts: string[] = [];
  if (profile.skinType) parts.push(`Skin type: ${profile.skinType}`);
  if (profile.sensitive) parts.push('Has sensitive skin');
  const concerns = [...profile.concerns, ...(profile.otherConcern ? [profile.otherConcern] : [])];
  if (concerns.length) parts.push(`Concerns: ${concerns.join(', ')}`);
  if (profile.budget) parts.push(`Budget: ${profile.budget}`);
  return parts.length ? parts.join('. ') : 'No skin profile information provided.';
}

const REASON_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      kind: { type: 'STRING', enum: ['positive', 'negative'] },
      text: { type: 'STRING' },
    },
    required: ['kind', 'text'],
  },
};

const COMPATIBILITY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    matchPercent: { type: 'NUMBER' },
    reasons: REASON_SCHEMA,
  },
  required: ['matchPercent', 'reasons'],
};

const IMAGE_ANALYSIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    productName: { type: 'STRING' },
    brand: { type: 'STRING' },
    matchPercent: { type: 'NUMBER' },
    reasons: REASON_SCHEMA,
  },
  required: ['productName', 'brand', 'matchPercent', 'reasons'],
};

const PRODUCT_CANDIDATES_SCHEMA = {
  type: 'OBJECT',
  properties: {
    products: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          productName: { type: 'STRING' },
          brand: { type: 'STRING' },
        },
        required: ['productName', 'brand'],
      },
    },
  },
  required: ['products'],
};

const ALTERNATIVES_SCHEMA = {
  type: 'OBJECT',
  properties: {
    alternatives: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          brand: { type: 'STRING' },
          price: { type: 'STRING' },
          matchPercent: { type: 'STRING' },
          note: { type: 'STRING' },
        },
        required: ['name', 'brand', 'price', 'matchPercent', 'note'],
      },
    },
  },
  required: ['alternatives'],
};

// Calls the Gemini REST API directly from the client. The API key ships inside the app bundle
// via EXPO_PUBLIC_GEMINI_API_KEY — fine for local testing, but before shipping this should be
// proxied through a backend so the key isn't exposed in the compiled app.
export class RestGeminiService implements GeminiService {
  async analyzeProduct(product: Product, profile: SkinProfile): Promise<GeminiCompatibility> {
    const prompt =
      `You are a skincare compatibility assistant for a teen skincare app. A user is considering ` +
      `this product: "${product.productName}" by ${product.brand}. User's skin profile: ` +
      `${describeProfile(profile)}. Based on your knowledge of this product's typical ingredients, ` +
      `rate from 0-100 how well-suited it is for this user (matchPercent), and give 2-4 short reasons ` +
      `(kind "positive" or "negative") tied to their skin type, sensitivity, concerns, and budget.`;

    return this.generate<GeminiCompatibility>(
      [{ text: prompt }],
      COMPATIBILITY_SCHEMA
    );
  }

  async searchProducts(query: string): Promise<GeminiProductCandidate[]> {
    const prompt =
      `A user is searching for a skincare product in a skincare app by typing: "${query}". ` +
      `List up to 5 real, currently sold skincare products (exact product name and brand) that ` +
      `plausibly match this search — matching the brand name, product line, or a close product name. ` +
      `Only include real, currently sold products; never invent one. If nothing plausible matches, ` +
      `return an empty list.`;

    const { products } = await this.generate<{ products: GeminiProductCandidate[] }>(
      [{ text: prompt }],
      PRODUCT_CANDIDATES_SCHEMA
    );
    return products;
  }

  async analyzeImage(
    base64Image: string,
    profile: SkinProfile,
    mimeType: string = 'image/jpeg'
  ): Promise<GeminiImageAnalysis> {
    const prompt =
      `You are a skincare compatibility assistant for a teen skincare app. Look at this photo of a ` +
      `skincare product's label or ingredient list. Identify the product name and brand strictly from ` +
      `the text actually printed on the packaging — read the label carefully rather than guessing from ` +
      `the container's general shape, color, or material, since many unrelated brands (e.g. Aquaphor vs. ` +
      `Nivea, both made by Beiersdorf) use similar-looking tins or tubs. If the printed brand/product ` +
      `name isn't clearly legible in the photo, say so honestly rather than guessing a well-known brand. ` +
      `User's skin profile: ${describeProfile(profile)}. Based on the ingredients you can read, rate ` +
      `from 0-100 how well-suited this product is for this user (matchPercent), and give 2-4 short ` +
      `reasons (kind "positive" or "negative") tied to their skin type, sensitivity, concerns, and budget.`;

    return this.generate<GeminiImageAnalysis>(
      [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Image } }],
      IMAGE_ANALYSIS_SCHEMA
    );
  }

  async suggestAlternatives(
    result: ScanResult,
    profile: SkinProfile
  ): Promise<Omit<AlternativeProduct, 'id'>[]> {
    const prompt =
      `You are an experienced dermatologist recommending skincare products to a teenager. ` +
      `They just scanned "${result.productName}" by ${result.brand}, which scored ${result.matchPercent}/100 ` +
      `for their skin, for these reasons: ${result.reasons.map((r) => r.text).join('; ')}. ` +
      `User's skin profile: ${describeProfile(profile)}. ` +
      `Recommend exactly 3 real, currently sold skincare products (from well-known, real brands only — ` +
      `never invent a brand or product name) that would suit this user's skin type, concerns, and budget ` +
      `better than the scanned product. For each, give its price exactly as listed on that product's own ` +
      `brand/manufacturer website (not a reseller or marketplace price) — if you're not confident of that ` +
      `exact price, give your best real-world estimate rather than guessing wildly. Also give an estimated ` +
      `matchPercent as a string like "91%", and a short note on why it fits them.`;

    const { alternatives } = await this.generate<{ alternatives: Omit<AlternativeProduct, 'id'>[] }>(
      [{ text: prompt }],
      ALTERNATIVES_SCHEMA
    );
    return alternatives;
  }

  private async generate<T>(parts: unknown[], responseSchema: unknown): Promise<T> {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY — add it to your .env file.');
    }

    const retryDelaysMs = [500, 1500];
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: 'application/json', responseSchema },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== 'string') {
          throw new Error('Gemini API response did not contain any text.');
        }
        return JSON.parse(text) as T;
      }

      const errorBody = await response.text();
      lastError = new Error(`Gemini API error ${response.status}: ${errorBody}`);

      // 503 = model temporarily overloaded on Google's side — worth a short retry.
      const canRetry = response.status === 503 && attempt < retryDelaysMs.length;
      if (!canRetry) throw lastError;
      await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]));
    }

    throw lastError;
  }
}

export const geminiService: GeminiService = new RestGeminiService();
